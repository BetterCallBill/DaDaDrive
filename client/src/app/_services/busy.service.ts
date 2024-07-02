import { Injectable, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;
  private spinnerService = inject(NgxSpinnerService);

  // method called Busy() added here
  busy() {                                                      
    // increment variable
    this.busyRequestCount++;                    
    this.spinnerService.show(undefined, {
      // choice of spinner we are using
      type: 'line-scale-party',                         
      // background of spinner
      bdColor: 'rgba(255,255,255,0)',            
      // spinner colour
      color: '#333333'                                  
    });
  }

  idle() {
    // decrement feature
    this.busyRequestCount--;                  
    // check what our busy request is .. handles if count is less than zero
    if (this.busyRequestCount <= 0) {     
      // re-set count to zero if less than zero   // acts as a safety mechanism
      this.busyRequestCount = 0;          
      // remove spinner once completed
      this.spinnerService.hide();              
    }
  }
}
