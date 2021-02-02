import { Component, OnInit } from '@angular/core';
import {Observable, Subscription, timer} from 'rxjs';
import {log} from 'util';


@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit {
  public isStartWatch = false;
  public isWaitWatch = false;
  public isSingleClick = false;
  public timer$: Subscription;
  public timerData = 0;
  public timeDisplay = null;
  public stopWatchTimes = [];

  constructor() {
    this.resetTimerDisplay();
  }

  ngOnInit(): void {
  }

  public startTimeCount(): void {                                                 //  Start/stop for counting timer
    this.isStartWatch = !this.isStartWatch;

    if (this.isStartWatch) {
      this.resetTimerDisplay();
      this.timerSubscribe();

    } else {
      this.isWaitWatch = false;
      this.timer$.unsubscribe();
    }
  }

  public waitTimer(e): void {                                                     //  Waiting/continue for counting timer
    if (!this.isWaitWatch) {
      if (this.isStartWatch && this.isSingleClick) {
        this.timer$.unsubscribe();
        this.isWaitWatch = true;
      }

      setTimeout(() => {
        this.isSingleClick = false;
      }, 300);
      this.isSingleClick = true;

    } else {
      this.timerSubscribe(this.timerData);
      this.isWaitWatch = false;
    }
  }

  public resetTimer(): void {                                                     // Reset timer data and resubscribe to counter
    if (this.isStartWatch) {
      this.timer$.unsubscribe();
      this.resetTimerDisplay();

      if (this.isWaitWatch) {
        this.isStartWatch = false;
        this.isWaitWatch = false;
      } else {
        this.timerSubscribe();
      }

    } else {
      this.resetTimerDisplay();
    }
  }

  public recordTime(): void {                                                     //  Record stopwatch time
    const timerObj = this.getDisplayTime(this.timerData);
    let currentTime = timerObj.hours.digit1 + timerObj.hours.digit2 + ':';
    currentTime += timerObj.minutes.digit1 + timerObj.minutes.digit2 + ':';
    currentTime += timerObj.seconds.digit1 + timerObj.seconds.digit2;
    this.stopWatchTimes.unshift(currentTime);
  }

  private timerSubscribe(time = 0): void {                                //  Start counting timer seconds,
    this.timer$ = timer(0, 1000)
      .subscribe((e) => {
        this.timerData = time + e;
        this.timeDisplay = this.getDisplayTime(this.timerData);
      });
  }

  private getDisplayTime(time: number): any {                                     //  Get timer in current format '00:00:00'
    const hours = '0' + Math.floor(time / 3600);
    const minutes = '0' + Math.floor(time % 3600 / 60);
    const seconds = '0' + Math.floor(time % 3600 % 60);

    return {
      hours: { digit1: hours.slice(-2, -1), digit2: hours.slice(-1) },
      minutes: { digit1: minutes.slice(-2, -1), digit2: minutes.slice(-1) },
      seconds: { digit1: seconds.slice(-2, -1), digit2: seconds.slice(-1) },
    };
  }

  private resetTimerDisplay(): void {                                             //  Reset timer to default
    this.stopWatchTimes = [];
    this.timerData = 0;
    this.timeDisplay = {
      hours: {digit1: '0', digit2: '0'},
      minutes: {digit1: '0', digit2: '0'},
      seconds: {digit1: '0', digit2: '0'},
    };
  }
}
