using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public LikesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var currentUserId = User.GetUserId();

            var targetUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var currentUser = await _unitOfWork.LikeRepository.GetUserWithLikes(currentUserId);

            if (targetUser == null) return NotFound();

            if (currentUser.UserName == username) return BadRequest("You cannot like yourself");

            // Check if there already have the like relationship
            var userLike = await _unitOfWork.LikeRepository.GetUserLikeRelationship(currentUserId, targetUser.Id);

            if (userLike != null) return BadRequest("You already liked this user");

            // If no relationship, create new
            userLike = new Entities.UserLike
            {
                SourceUserId = currentUserId,
                LikedUserId = targetUser.Id
            };

            currentUser.LikedUsers.Add(userLike);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to like this user");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery] LikesPaginationParams likePaginationParams)
        {
            likePaginationParams.UserId = User.GetUserId();
            var users = await _unitOfWork.LikeRepository.GetUserLikes(likePaginationParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }
    }
}