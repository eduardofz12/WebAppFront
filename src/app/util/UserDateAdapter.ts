import { Injectable } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserDateAdapter extends NativeDateAdapter {

    parse(value: any): Date | null {
        if(typeof value === 'string') {
            if ((value.indexOf('/') > -1) &&  value.length == 10) {
                const str = value.split('/');
                const year = Number(str[2]);
                const month = Number(str[1]) - 1;
                const day = Number(str[0]);
                const date = new Date(year, month, day);
                return date;
            } else if (value.length == 8 && !(value.indexOf('/') > -1)){
                const day = Number(value.substring(0,2));
                const month = Number(value.substring(2,4))-1;
                const year = Number(value.substring(4));
                if((day > 0 && day < 32) && (month >= 0 && month < 13) && (year > 1 && year < 2099)){
                    const date = new Date(year, month, day);
                    return date;
                } else {
                    return new Date();
                }
            }
        }
        return new Date("0/0/0");
    }

    parseYYYYMMDD(date: any): string {
        if(date) {
            return this.toIso8601(date);
        }
        return '';
        // if(date == null) {
        //     date = new Date();
        // }
        // var mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        // day = ("0" + date.getDate()).slice(-2);
        // return [date.getFullYear(), mnth, day].join("-");
    }
}