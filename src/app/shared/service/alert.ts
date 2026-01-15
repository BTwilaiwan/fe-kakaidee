import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertPosition, SweetAlertResult } from 'sweetalert2';
import { AlertClassType } from '../model/alert';
import { DColorEnum } from '../model/button';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  constructor(
  ) { }

  alert(icon: SweetAlertIcon, title: string = 'Title Message', message: string = 'Test description message !!', customClass: AlertClassType = 'button-w-full full-content') {
    return Swal.fire({
      title: title,
      html: message,
      icon: icon,
      iconHtml: icon != 'question' ? `<i class="alert-icon-${icon} w-20 h-20"></i>` : '',
      customClass: {
        popup: `${customClass} d-alert`
      },
      confirmButtonText: 'OK'
    });
  }

  confirmAlert(icon: SweetAlertIcon, title: string = 'Title Message', message: string = 'Test description message !!', customClass: AlertClassType = 'button-w-auto inline-content', confirmButtonText?: string, cancelButtonText?: string, input: any = '') {
    return Swal.fire({
      title: title,
      html: message,
      icon: icon,
      iconHtml: icon != 'question' ? `<i class="alert-icon-${icon} w-20 h-20"></i>` : '',
      customClass: {
        popup: `${customClass} d-alert`
      },
      showCancelButton: true,
      confirmButtonText: confirmButtonText ?? 'YES',
      cancelButtonText: cancelButtonText ?? 'NO',
      input: input,
      preConfirm: (result) => {
        if (result === null || result === '' || result === undefined) {
          Swal.showValidationMessage(
            'Required Field'
          );
        }
      },
      inputPlaceholder: 'Comment'
    });
  }

  showAlertArr(icon: SweetAlertIcon, title: string = 'Validate error', msgs: string[]): Promise<SweetAlertResult> {
    let msg = '<ul class="validate-error">';

    msgs.forEach(o => {
      msg += `<li>${o}</li>`;
    })

    msg += '</ul>'

    return this.alert(icon, title, msg);
  }

  snackBar(message: string = 'Message', position: SweetAlertPosition = 'top-right', color: DColorEnum = DColorEnum.info, timer: number = 1000) {
    Swal.fire({
      toast: true,
      width: '400px',
      customClass: {
        popup: `d-snackbar ` + color
      },
      title: `<div class="text-lg font-light">${message}</div>`,
      position: position,
      showConfirmButton: false,
      showCloseButton: true,
      closeButtonHtml: '<div class="text-lg font-light"><i class="fa-duotone fa-xmark cursor-pointer"></i></div>',
      timer,
    });
  }

  alertTimerOnConfirmBtn(
    icon: SweetAlertIcon,
    timer: number,
    title: string = 'Title Message',
    message: string = 'Test description message !!',
    customClass: string = 'button-w-full full-content'  // เปลี่ยนเป็น string
  ) {
    let timerInterval: any;
    return Swal.fire({
      title: title,
      html: message,
      icon: icon,
      iconHtml: icon !== 'question' ? `<i class="alert-icon-${icon} w-20 h-20"></i>` : '',
      customClass: {
        popup: `${customClass} d-alert`
      },
      timer: timer,
      didOpen: () => {
        const timerBtn = Swal.getPopup()?.querySelector(".swal2-confirm") || null;
        const startTime = Date.now();
        timerInterval = setInterval(() => {
          const timerLeft = Swal.getTimerLeft();
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, timer - elapsed);
          if (timerBtn && timerLeft !== null) {
            timerBtn.textContent = `OK (${Math.ceil(remaining / 1000)} s)`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  }


  deleteAlert(title: string = 'ALERT.Confirm', message: string = 'Test description message !!',confirmButtonText:string = 'SYSTEM.OK',cancelButtonText:string = 'SYSTEM.CANCEL' ,customClass: string = '') {
    return Swal.fire({
      title: `<span class="text-red-600">${title ? title : 'Confirm'}</span>`,
      html: message,
      //text:this._tran.translate(message),
      //icon:'error',
      iconHtml: '<i class="fa-solid fa-trash-can icon-custom-sweet-alert border-red-50 bg-red-100 text-red-500"></i>',
      customClass: {
        popup: `${customClass}`
      },
      showConfirmButton:true,
      confirmButtonText: confirmButtonText,
      showCancelButton: true,
      cancelButtonText: cancelButtonText,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }
}
