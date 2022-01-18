using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikeRepository : ILikeRepository
    {
        private readonly DataContext _dataContext;

        public LikeRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<UserLike> GetUserLikeRelationship(int sourceUserId, int likedUserId)
        {
            return await _dataContext.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesPaginationParams likesPaginationParams)
        {
            var users = _dataContext.Users.OrderBy(x => x.UserName).AsQueryable();
            var likes = _dataContext.Likes.AsQueryable();

            // Get LikedUser
            if (likesPaginationParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesPaginationParams.UserId);
                users = likes.Select(like => like.LikedUser);
            }

            // Get SourceUser
            if (likesPaginationParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likesPaginationParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUser = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                Suburb = user.Suburb,
                Id = user.Id
            });

            return await PagedList<LikeDto>.CreateAsync(likedUser, likesPaginationParams.PageNumber, likesPaginationParams.PageSize);
        }

        // Get users with their liked users
        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _dataContext.Users.Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}