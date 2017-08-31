import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { FlashMessagesService, FlashMessagesModule } from 'angular2-flash-messages';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      // declarations: [ AppComponent],
      imports: [
        RouterTestingModule,
        FlashMessagesModule
      ],
      declarations: [
        AppComponent
      ]
      // }).compileComponents();
    });
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);

    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Road Trip Social'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    console.log(app.title);
    expect(app.title).toEqual('Road Trip Social');
  }));

  xit('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Road Trip Social!!');
  }));
});
