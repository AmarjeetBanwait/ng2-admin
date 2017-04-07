import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';

import { NgaMenuItem, NgaMenuModuleConfig } from './menu.options';

@Injectable()
export class NgaMenuService {

  private menuItems: List<NgaMenuItem>;
  private menuItemsChanges$ = new Subject();

  menuItemsChanges: Observable<List<NgaMenuItem>> = this.menuItemsChanges$.asObservable();

  constructor(@Optional() private config: NgaMenuModuleConfig,
                          private router: Router) {

    this.menuItems = this.config.menuItems;
  }

  getMenuItems(): Observable<List<NgaMenuItem>> {
    return Observable.create((observer: any) => {
      this.prepareMenuItems(this.menuItems);

      observer.next(this.menuItems);
      observer.complete();
    });
  }

  addMenuItem(item: NgaMenuItem) {
    const result = this.menuItems.push(item);

    this.menuItemsChanges$.next(result);
    this.menuItemsChanges$.complete();
  }

  selectMenuItem(item: NgaMenuItem) {
    console.log(item);
  }

  private prepareMenuItems(items: List<NgaMenuItem>) {
    items.forEach(i => this.prepareMenuItem(i));
  }

  private prepareMenuItem(parent: NgaMenuItem) {
    if (parent.children && parent.children.size > 0) {
      const childWithoutParent = parent.children.filter(c => c.parent === null || c.parent === undefined).first();

      if (childWithoutParent) {
        childWithoutParent.parent = parent;

        this.prepareMenuItem(childWithoutParent);
      }
    } else if (parent.parent) {
      this.prepareMenuItem(parent.parent);
    }
  }

}
