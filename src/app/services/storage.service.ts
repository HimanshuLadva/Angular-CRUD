import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  productArr:any[] =[];
  constructor() { }
  
  getItemsFromLocalStorage() {
    const data =  localStorage.getItem('productArr');
    if(data) {
       this.productArr = JSON.parse(data) || [];
    }
    return this.productArr;
  }

  setItemInLocalStorage(data:any) {
     data.code = new Date().getTime().toString()    
     .split('')     
     .map(Number)  
     .map(n => (n || 10) + 64)   
     .map(c => String.fromCharCode(c))  
     .join('')
     .toLowerCase()
     .slice(-6);
     data.isCheck = false;
     this.productArr.push(data);
     localStorage.setItem('productArr', JSON.stringify(this.productArr));
  }

  editItemInLocalStorage(data:any, id:string) {
     const index = this.productArr.findIndex((ele) => ele.code  == id);
     data.code = id;
     data.isCheck = this.productArr[index]?.isCheck;
     this.productArr[index] = data;
     console.log("updated data", this.productArr[index]);
     
     localStorage.setItem('productArr', JSON.stringify(this.productArr));
  }

    deleteItemFromLocalStorage(id:string) {
    this.productArr = this.productArr.filter(ele => ele.code != id);
    localStorage.setItem('productArr', JSON.stringify(this.productArr));
  }

  deleteSelectedInLocStorage() {
    this.productArr = this.productArr.filter(ele => ele.isCheck != true);
    localStorage.setItem('productArr', JSON.stringify(this.productArr));
  }
}
