import { Component, OnInit, Renderer2, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash';

@Component({
	selector: 'text-tag',
	templateUrl: './text-tag.component.html',
	styleUrls: ['./text-tag.component.css']
})
export class TextTagComponent implements OnInit {
	@Input() text: string;
	@Input() tags: string[];

	document: Document;
	textArray: string[];
	tagData = { 'tagA': [], 'tagB': [], 'tagD': [], 'tagC': [] };
	tagDataArray = { 'tagA': [], 'tagB': [], 'tagD': [], 'tagC': [] };
	htmlOfText = [];
	selectedTag: string;
	selectedTagColor: string;
	selection: Selection;

	ngOnInit() { }

	ngOnChanges() {
		this.textArray = this.text.split(' ');
	}

	constructor(private renderer: Renderer2, @Inject(DOCUMENT) dom: Document) {
		this.document = dom;
	}

	public renderRectangles(selection: Selection): void {
		this.selection = selection;

		if (!this.selection.getRangeAt(0).cloneContents().querySelectorAll('mark').length) {
			let highlightedContent: Range = selection.getRangeAt(0);

			let startContainer = highlightedContent.startContainer;
			let endContainer = highlightedContent.endContainer;

			if (startContainer.isSameNode(endContainer)) {
				this.addTag(highlightedContent, true, Number((this.document.getSelection().anchorNode.parentElement.id).split('#')[1]), Number((this.document.getSelection().focusNode.parentElement.id).split('#')[1]));
			}
			else {
				let startId, endId;
				(Number((this.document.getSelection().anchorNode.parentElement.id).split('#')[1]) < Number((this.document.getSelection().focusNode.parentElement.id).split('#')[1])) ?
					(startId = Number((this.document.getSelection().anchorNode.parentElement.id).split('#')[1]), endId = Number((this.document.getSelection().focusNode.parentElement.id).split('#')[1])) :
					(startId = Number((this.document.getSelection().focusNode.parentElement.id).split('#')[1]), endId = Number((this.document.getSelection().anchorNode.parentElement.id).split('#')[1]));

				this.addTag(highlightedContent, false, startId, endId);
			}
		} else {
			this.selection.removeAllRanges();
		}
	}

	addTag(highlightedContent: Range, sameNode: boolean, startId: number, endId: number) {
		let tag = this.renderer.createElement('span');
		tag.textContent = this.selectedTag;
		tag.className = 'tag-style';

		let selectedTag = this.selectedTag;

		let markElement = this.renderer.createElement('mark');
		markElement.className = this.selectedTagColor;

		let close = this.renderer.createElement('span');
		close.className = 'remove-tag-icon';
		close.innerText = '×';
		close.addEventListener('click', () => this.removeTag({ element: markElement, sameNode: sameNode, startId: startId, endId: endId, tag: selectedTag }));

		if (sameNode) {
			let element = this.document.getElementById(this.selection.anchorNode.parentElement.id);

			markElement.append(close, element.cloneNode(true), tag);
			element.replaceWith(markElement);
			element.remove();

			this.tagDataArray[this.selectedTag] = [...this.tagDataArray[this.selectedTag], startId];
		} else {
			let firstChild = highlightedContent.startContainer.parentElement;
			let lastChild = highlightedContent.endContainer.parentElement;

			highlightedContent.setStart(highlightedContent.startContainer.parentNode, 0);
			highlightedContent.setEnd(highlightedContent.endContainer.parentNode, 1);
			markElement.append(close, highlightedContent.extractContents(), tag);

			highlightedContent.insertNode(markElement);
			this.selection.removeAllRanges();

			this.tagDataArray[this.selectedTag] = [...this.tagDataArray[this.selectedTag], _.range(startId, endId + 1)]

			firstChild.innerText = '';
			lastChild.innerText = '';
			firstChild.remove();
			lastChild.remove();
		}

		console.log(this.getTagData())
	}

	removeTag(event) {
		let markElement = event.element;
		markElement.removeChild(markElement.childNodes[0]);
		markElement.removeChild(markElement.childNodes[markElement.childNodes.length - 1]);
		markElement.replaceWith(...markElement.childNodes);
		if (event.sameNode) {
			_.remove(this.tagDataArray[event.tag], (value) => {
				return value === event.startId;
			});
		} else {
			_.remove(this.tagDataArray[event.tag], (value) => {
				return _.isEqual(value, _.range(event.startId, event.endId + 1));
			});
		}

		console.log(this.getTagData())
	}

	setTagToText(tag: string, config: string) {
		this.selectedTag = tag;
		this.selectedTagColor = config;
	}

	getTagData() {
		this.tags.forEach(tag => {
			this.tagData[tag] = [];
			this.tagDataArray[tag].forEach(index => {
				if (index.length > 1) {
					this.tagData[tag].push(this.textArray.slice(index[0], index[index.length - 1] + 1).join(' '));
				} else {
					this.tagData[tag].push(this.textArray[index]);
				}
			});
		});

		return { tagData: this.tagData, tagDataIndexes: this.tagDataArray, tagText: this.text };
	}

}
