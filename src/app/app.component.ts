import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BehaviorSubject, ReplaySubject, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  subjects;
  subscriptionValues;
  behaviorSubjectValue: any;
  replaySubjectBufferValue: number;
  selectedSubjectIndexToSubscribe: number = 0;
  selectedSubjectIndexToNext: number = 0;
  destroySource;

  constructor() {
    this.subjects = new Array<Subject<any>>();
    this.subscriptionValues = new Array<Array<any>>();
    this.replaySubjectBufferValue = 0;
    this.destroySource = new Subject();
    this.behaviorSubjectValue = '';
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  makeSubject() {
    this.subjects.push(new Subject());
  }

  makeBehaviorSubject() {
    this.subjects.push(new BehaviorSubject(this.behaviorSubjectValue));
  }

  makeReplaySubject() {
    this.subjects.push(new ReplaySubject(this.replaySubjectBufferValue));
  }

  onSubjectSelected(subject: Subject<any> | undefined) {
    const array = new Array();
    subject?.pipe(
      takeUntil(this.destroySource)
    ).subscribe(value => {
      array.push(`Subject number: ${this.subjects.indexOf(subject)}, ${this.getSubjectType(subject)}: ${value}`)
    })
    this.subscriptionValues.push(array);
  }

  getSubjectType(subject: Subject<any>) {
    if (subject instanceof BehaviorSubject) {
      return "BehaviorSubject";
    }
    if (subject instanceof ReplaySubject) {
      return "ReplaySubject";
    }
    return "Subject";
  }

  protected readonly Date = Date;

  next() {
    let pipe = new DatePipe('en-US');
    this.subjects[this.selectedSubjectIndexToNext]?.next(pipe.transform(Date.now(), 'short'));
  }

  toColor(num: number) {
    num++;
    return "rgba(" + [num * 100 % 255, num * 200 % 255, num * 500 % 255, 1].join(",") + ")";
  }
}
