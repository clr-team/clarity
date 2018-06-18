/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component} from "@angular/core";

import {TestContext} from "../../data/datagrid/helpers.spec";
import {IfOpenService} from "../../utils/conditional/if-open.service";
import {TAB, UP_ARROW} from "../../utils/key-codes/key-codes";
import {createKeyboardEvent} from "../datepicker/utils/test-utils";

import {ClrSelect} from "./select";

@Component({
    template: `
        <clr-select>
            <div class="menu">
                Test
            </div>
        </clr-select>
    `
})
class TestComponent {
}

@Component({
    template: `
        <clr-select>
            <clr-options class="test">
                Test
            </clr-options>
        </clr-select>
    `
})
class TestSelectWithMenu {
}

@Component({
    template: `
        <clr-select>
            <clr-option>
                Option 1
            </clr-option>
            <clr-option>
                Option 2
            </clr-option>
        </clr-select>
    `
})
class TestOptionSelection {
}

export default function(): void {
    describe("Select Component", function() {
        let context: TestContext<ClrSelect, TestComponent>;
        let ifOpenService: IfOpenService;

        describe("Typescript API", function() {
            beforeEach(function() {
                context = this.create(ClrSelect, TestComponent, []);
                ifOpenService = context.getClarityProvider(IfOpenService);
            });

            it("provides a method to toggle the popover on click", () => {
                expect(ifOpenService.open).toBeUndefined();

                context.clarityDirective.toggleOptionsMenu(new MouseEvent("click"));

                expect(open).not.toBe(true);

                context.clarityDirective.toggleOptionsMenu(new MouseEvent("click"));

                expect(open).not.toBe(false);
            });

            it("provides a method to close the popover on tab key press", () => {
                ifOpenService.open = true;

                context.clarityDirective.closeMenuOnTabPress(createKeyboardEvent(UP_ARROW, "up-arrow"));

                expect(ifOpenService.open).toBe(true);

                context.clarityDirective.closeMenuOnTabPress(createKeyboardEvent(TAB, "tab"));

                expect(ifOpenService.open).toBe(false);
            });

            it("provides a method to focus on the input", () => {
                let focused = context.clarityElement.querySelector(":focus");

                expect(focused).toBeNull();

                context.clarityDirective.focusInput();

                focused = context.clarityElement.querySelector(":focus");

                expect(focused.classList.contains("clr-select-input")).toBe(true);
            });
        });

        describe("View Basics", () => {
            beforeEach(function() {
                context = this.create(ClrSelect, TestComponent, []);
                ifOpenService = context.getClarityProvider(IfOpenService);
            });

            it("projects content", () => {
                expect(context.clarityElement.textContent).toMatch(/Test/);
            });

            it("creates the clr-options menu when the consumer hasn't provided it", () => {
                const menus = context.clarityElement.querySelectorAll("clr-options");
                expect(menus.length).toBe(1);
                expect(menus[0].innerHTML).toMatch(/Test/);
            });

            it("adds the .clr-select class on the host", () => {
                expect(context.clarityElement.classList.contains("clr-select")).toBe(true);
            });

            it("contains an editable input", () => {
                const input = context.clarityElement.querySelector(".clr-select-input");
                expect(input).not.toBeNull();
                expect(input.hasAttribute("contenteditable")).toBe(true);
                expect(input.getAttribute("contenteditable")).toBe("true");
            });

            it("contains a options menu trigger", () => {
                expect(context.clarityElement.querySelector(".clr-select-trigger")).not.toBeNull();
            });

            it("opens the menu on the trigger click", () => {
                const trigger = context.clarityElement.querySelector(".clr-select-trigger");

                expect(ifOpenService.open).toBeUndefined();

                trigger.click();

                expect(ifOpenService.open).toBe(true);
            });

            it("keeps the options menu open when the input is clicked", () => {
                ifOpenService.open = true;

                const input = context.clarityElement.querySelector(".clr-select-input");
                input.click();

                expect(ifOpenService.open).toBe(true);
            });

            it("closes the menu when the select trigger is clicked", () => {
                ifOpenService.open = true;

                const trigger = context.testElement.querySelector(".clr-select-trigger");
                trigger.click();

                expect(ifOpenService.open).toBe(false);
            });

            it("calls the focusInput method when the host is clicked", () => {
                spyOn(context.clarityDirective, "focusInput");

                const select = context.clarityElement;

                select.click();

                expect(context.clarityDirective.focusInput).toHaveBeenCalled();
            });

            it("calls the closeMenuOnTabPress method when a tab keyboard event is dispatched on the input", () => {
                spyOn(context.clarityDirective, "closeMenuOnTabPress");

                const input = context.clarityElement.querySelector(".clr-select-input");
                input.dispatchEvent(createKeyboardEvent(TAB, "keydown"));

                expect(context.clarityDirective.closeMenuOnTabPress).toHaveBeenCalled();
            });
        });

        describe("Select with Menu", () => {
            beforeEach(function() {
                context = this.create(ClrSelect, TestSelectWithMenu, []);
            });

            it("renders the menu projected by the consumer", () => {
                const menus = context.clarityElement.querySelectorAll("clr-options");
                expect(menus.length).toBe(1);
                expect(menus[0].classList.contains("test")).toBe(true);
            });
        });

        describe("Rendering Selected Option", () => {
            beforeEach(function() {
                context = this.create(ClrSelect, TestOptionSelection, []);
            });

            it("renders the selected option in the input when it is clicked", () => {
                const options = context.clarityElement.querySelectorAll(".clr-option");
                let input: HTMLElement = context.clarityElement.querySelector(".clr-select-input");

                expect(input.children.length).toBe(0);

                options[0].click();

                input = context.clarityElement.querySelector(".clr-select-input");

                expect(input.textContent).toMatch(/Option 1/);
            });

            it("clears the previous selection and renders the new selection in the input", () => {
                const options = context.clarityElement.querySelectorAll(".clr-option");
                let input: HTMLElement = context.clarityElement.querySelector(".clr-select-input");

                options[0].click();

                expect(input.children.length).toBe(1);
                expect(input.textContent).toMatch(/Option 1/);

                options[1].click();

                input = context.clarityElement.querySelector(".clr-select-input");

                expect(input.children.length).toBe(1);
                expect(input.textContent).toMatch(/Option 2/);
            });
        });
    });
}
