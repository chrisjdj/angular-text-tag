import { Directive, OnInit, OnDestroy, EventEmitter, ElementRef, NgZone, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Directive({
  selector: '[textTag]',
  outputs: ["textTagEvent: textTag"]
})
export class TextTagDirective implements OnInit, OnDestroy {
  document: Document;
  public textTagEvent: EventEmitter<Selection>;
  private elementRef: ElementRef;
  private hasSelection: boolean;
  private zone: NgZone;
  listenerFnMouseUp: () => void;
  listenerFnMouseDown: () => void;
  listenerFnSelectionChange: () => void;

  constructor(
    elementRef: ElementRef,
    zone: NgZone,
    private renderer: Renderer2,
    @Inject(DOCUMENT) dom: Document
  ) {
    this.elementRef = elementRef;
    this.zone = zone;

    this.hasSelection = false;
    this.textTagEvent = new EventEmitter();

    this.document = dom;
  }

  public ngOnDestroy(): void {
    if (this.listenerFnMouseDown) this.listenerFnMouseDown();
    if (this.listenerFnMouseUp) this.listenerFnMouseUp();
    if (this.listenerFnSelectionChange) this.listenerFnSelectionChange();
  }

  public ngOnInit(): void {
    this.zone.runOutsideAngular(
      () => {
        this.listenerFnMouseDown = this.renderer.listen(this.elementRef.nativeElement, 'mousedown', this.handleMousedown);
        this.listenerFnSelectionChange = this.renderer.listen(this.document, 'selectionchange', this.handleSelectionchange);
      }
    );
  }

  private getRangeContainer(range: Range): Node {
    let container = range.commonAncestorContainer;
    while (container.nodeType !== Node.ELEMENT_NODE) {
      container = container.parentNode;
    }
    return (container);
  }

  private handleMousedown = (): void => {
    this.listenerFnMouseUp = this.renderer.listen(this.document, 'mouseup', this.handleMouseup);
  }

  private handleMouseup = (): void => {
    if (this.listenerFnMouseUp)
      this.listenerFnMouseUp();
    this.processSelection();
  }

  private handleSelectionchange = (): void => {
    if (this.hasSelection) {
      this.processSelection();
    }
  }

  private processSelection(): void {
    let selection = this.document.getSelection();
    if (this.hasSelection) {
      this.zone.runGuarded(
        () => {

          this.hasSelection = false;
        }
      );
    }

    if (!selection.rangeCount || !selection.toString()) {
      return;
    }

    let range = selection.getRangeAt(0);
    let rangeContainer = this.getRangeContainer(range);

    if (this.elementRef.nativeElement.contains(rangeContainer)) {
      this.zone.runGuarded(
        () => {
          this.hasSelection = true;
          this.textTagEvent.emit(selection);
        }
      );
    } else {
      selection.removeAllRanges();
    }
  }
}