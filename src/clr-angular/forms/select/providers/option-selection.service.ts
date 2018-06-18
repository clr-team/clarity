/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Injectable} from "@angular/core";
import {ClrOption} from "../option";
import {Subject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class OptionSelectionService {
    //Array as we need support for selecting multiple options
    currentSelection: Array<ClrOption> = [];

    private _selectionChanged: Subject<void> = new Subject<void>();

    get selectionChanged(): Observable<void> {
        return this._selectionChanged.asObservable();
    }

    //Currently only handles single selection
    updateSelection(option: ClrOption): void {
        if (this.currentSelection.indexOf(option) > -1) {
            return;
        }
        if (this.currentSelection.length === 1) {
            this.currentSelection[0].selected = false;
        }
        option.selected = true;
        this.currentSelection = [option];
        this._selectionChanged.next();
    }
}
