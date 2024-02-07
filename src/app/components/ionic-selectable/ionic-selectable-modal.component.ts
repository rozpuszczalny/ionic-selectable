import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInfiniteScroll, IonSearchbar, IonicModule, NavParams } from '@ionic/angular';
import { DynamicSizeVirtualScrollStrategy, RxVirtualFor, RxVirtualScrollViewportComponent } from '@rx-angular/template/experimental/virtual-scrolling';
import { IonicSelectableComponent } from './ionic-selectable.component';
import {RxLet} from '@rx-angular/template/let';

@Component({
    selector: 'ionic-selectable-modal',
    templateUrl: './ionic-selectable-modal.component.html',
    standalone: true,
    imports: [
      IonicModule,
      NgIf,
      NgTemplateOutlet,
      FormsModule,
      NgFor,
      NgClass,
      NgStyle, 
      RxVirtualFor,
      RxVirtualScrollViewportComponent,
      DynamicSizeVirtualScrollStrategy,
      RxLet
    ]
})
export class IonicSelectableModalComponent implements AfterViewInit {
  @ViewChild(IonContent)
  _content!: IonContent;
  _header!: HTMLElement;
  selectComponent: IonicSelectableComponent;
  @ViewChild('searchbarComponent')
  _searchbarComponent!: IonSearchbar;
  @ViewChild(IonInfiniteScroll)
  _infiniteScroll!: IonInfiniteScroll;
  @HostBinding('class.ionic-selectable-modal')
  _cssClass = true;
  @HostBinding('class.ionic-selectable-modal-can-clear')
  get _canClearCssClass(): boolean {
    return this.selectComponent.canClear;
  }
  @HostBinding('class.ionic-selectable-modal-is-multiple')
  get _isMultipleCssClass(): boolean {
    return this.selectComponent.isMultiple;
  }
  @HostBinding('class.ionic-selectable-modal-is-searching')
  get _isSearchingCssClass(): boolean {
    return this.selectComponent._isSearching;
  }
  @HostBinding('class.ionic-selectable-modal-ios')
  get _isIos(): boolean {
    return this.selectComponent._isIos;
  }
  @HostBinding('class.ionic-selectable-modal-md')
  _isMD(): boolean {
    return this.selectComponent._isMD;
  }
  @HostBinding('class.ionic-selectable-modal-is-add-item-template-visible')
  get _isAddItemTemplateVisibleCssClass(): boolean {
    return this.selectComponent._isAddItemTemplateVisible;
  }
  @HostListener('window:resize')
  onResize() {
    // ion-footer inside the template might change its height when
    // device orientation changes.
    this.selectComponent._positionAddItemTemplate();
  }

  itemHeightFn = (item: any) => {
    const itemHeight = this.selectComponent.virtualScrollHeightFn(item);
    if (!this.selectComponent.virtualScrollHeaderFn) {
      return itemHeight;
    }
    const header = this.getHeader(item, this.selectComponent._filteredGroups[0].items.indexOf(item), this.selectComponent._filteredGroups[0].items);
    const headerHeight = header ? this.selectComponent.virtualScrollHeaderHeightFn(item) : 0;

    return itemHeight + headerHeight;
  }

  constructor(
    private navParams: NavParams,
    public _element: ElementRef,
  ) {
    this.selectComponent = this.navParams.get('selectComponent');
    this.selectComponent._modalComponent = this;
    this.selectComponent._selectedItems = [];

    if (!this.selectComponent._isNullOrWhiteSpace(this.selectComponent.value)) {
      if (this.selectComponent.isMultiple) {
        this.selectComponent.value.forEach((item: any) => {
          this.selectComponent._selectedItems.push(item);
        });
      } else {
        this.selectComponent._selectedItems.push(this.selectComponent.value);
      }
    }

    this.selectComponent._setItemsToConfirm(this.selectComponent._selectedItems);
  }

  getHeader(item: any, index: number, items: any[]) {
    if (!this.selectComponent.virtualScrollHeaderFn) {
      return null;
    }
    const header = this.selectComponent.virtualScrollHeaderFn(item, index, items);
    if (!header) {
      return null;
    }

    return header;
  }

  ngAfterViewInit() {
    this._header = this._element.nativeElement.querySelector('ion-header');

    if (this._searchbarComponent && this.selectComponent.shouldFocusSearchbar) {
      // Focus after a delay because focus doesn't work without it.
      setTimeout(() => {
        this._searchbarComponent.setFocus();
      }, 1000);
    }
  }
}
