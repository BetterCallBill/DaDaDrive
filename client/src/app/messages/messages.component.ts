import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
	messages: Message[];
	pagination: Pagination;
	container = 'Inbox';
	pageNumber = 1;
	pageSize = 6;

	constructor(private messageSerivce: MessageService) {}

	ngOnInit(): void {
		this.loadMessages();
	}

	// Call getMessages(pageNumber, pageSize, container) from messageSerivce
	loadMessages() {
		this.messageSerivce
			.getMessages(this.pageNumber, this.pageSize, this.container)
			.subscribe((response) => {
				this.messages = response.result;
				this.pagination = response.pagination;
			});
	}

	pageChanged(event: any) {
		if (this.pageNumber !== event.page) {
			this.pageNumber = event.page;
			this.loadMessages();
		}
	}
}
