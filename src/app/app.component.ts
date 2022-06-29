import { Component, ViewChild } from '@angular/core';
import { TextTagComponent } from './text-tag/component/text-tag.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(TextTagComponent, { static: false }) textTagComponent: TextTagComponent;

  tags: string[] = tags;
  text: string = text;
  config = configOfTags;
  activeTag: string;

  setTag(tag: string) {
    this.activeTag = tag;
    this.textTagComponent.setTagToText(tag, this.config[tag]);
  }
}

export const configOfTags = {
  "tagA": "tag-tagA",
  "tagB": "tag-tagB",
  "tagC": "tag-tagC",
  "tagD": "tag-tagD"
};

export const tags = ["tagA", "tagB", "tagC", "tagD"];

export const text =
  `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`;