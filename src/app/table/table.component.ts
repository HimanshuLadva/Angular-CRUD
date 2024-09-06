import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  isAddForm = false;
  isEditForm = false;
  showData: any[] = [];
  editData: any;
  arrow = 'up';
  page = 1;
  total = 0;
  productPerPageArr = [5, 10, 15, 20];
  productPerPage: number = 5;
  loginEditReactiveForm: FormGroup;
  searchword = '';

  constructor(private _storageService: StorageService) {}

  loginReactiveForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]*'),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]*'),
    ]),
    image: new FormControl('', [Validators.required]),
    rating: new FormControl('', [Validators.required]),
    select: new FormControl('', [Validators.required]),
    radioinput: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (this.searchword == '') {
      this.showData = this._storageService.getItemsFromLocalStorage();
      this.total = this.showData.length;
    } else {
      this.showData = this.showData.filter((ele) =>
        ele.name.includes(this.searchword)
      );
      this.total = this.showData.length;
    }
  }
  submitEditData() {
    console.log(this.loginEditReactiveForm.value);
    const index = this.showData.findIndex(
      (ele) => ele.code == this.editData.code
    );
    this.showData[index] = this.loginEditReactiveForm.value;
    this.isEditForm = !this.isEditForm;
    this._storageService.editItemInLocalStorage(
      this.loginEditReactiveForm.value,
      this.editData.code
    );
  }
  submitData(myForm: any) {
    console.log('hello in submit');
    // this.showData.push(this.loginReactiveForm.value);
    this._storageService.setItemInLocalStorage(this.loginReactiveForm.value);
    this.isAddForm = !this.isAddForm;
    this.total = this.total + 1;
    myForm.value = '';
    this.loadData();
    this.loginReactiveForm.reset();
  }

  checking(id: string) {
    const index = this.showData.findIndex((ele) => ele.code == id);
    this.showData[index].isCheck = !this.showData[index].isCheck;
    this._storageService.editItemInLocalStorage(this.showData[index], id);
  }
  deleteRow(id: string) {
    this.showData = this.showData.filter((ele) => ele.code != id);
    this.total = this.showData.length;
    this._storageService.deleteItemFromLocalStorage(id);
  }

  openEditForm(id: number) {
    this.isEditForm = !this.isEditForm;
    this.editData = this.showData.find((ele) => ele.code == id);
    this.loginEditReactiveForm = new FormGroup({
      name: new FormControl(this.editData['name'], [
        Validators.required,
        Validators.pattern('[a-zA-Z]*'),
      ]),
      description: new FormControl(this.editData['description'], [
        Validators.required,
        Validators.pattern('[a-zA-Z]*'),
      ]),
      image: new FormControl(this.editData['image'], [Validators.required]),
      rating: new FormControl(this.editData['rating'], [Validators.required]),
      select: new FormControl(this.editData['select'], [Validators.required]),
      radioinput: new FormControl(this.editData['radioinput'], [
        Validators.required,
      ]),
      price: new FormControl(this.editData['price'], [Validators.required]),
      quantity: new FormControl(this.editData['quantity'], [
        Validators.required,
      ]),
    });
    console.log(this.editData);
  }

  deleteSelected() {
    this.showData = this.showData.filter((ele) => ele.isCheck == false);
    this._storageService.deleteSelectedInLocStorage();
    this.total = this.showData.length;
  }

  selectAll(data: any) {
    this.showData.forEach((ele) =>
      data.checked ? (ele.isCheck = true) : (ele.isCheck = false)
    );
  }
  // ----------------------------------------------------------------------------------------------------------------
  openForm() {
    this.isAddForm = true;
  }

  closeForm() {
    this.isAddForm = false;
    this.isEditForm = false;
  }

  sortList(sortVal: string) {
    this.arrow == 'up'
      ? this.showData.sort((a, b) => (a[sortVal] > b[sortVal] ? -1 : 1))
      : this.showData.sort((a, b) => (a[sortVal] > b[sortVal] ? 1 : -1));
    this.arrow = this.arrow == 'up' ? 'down' : 'up';
  }

  searchWord(word: string) {
    this.searchword = word;
    this.loadData();
  }

  itemPerPage(perPageNumber: number) {
    this.productPerPage = perPageNumber;
    this.page = 1;
  }
  pageChangeEvent(event: number) {
    this.page = event;
  }

  fileDownload() {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'product list',
      useBom: true,
      noDownload: false,
      headers: ['Name', 'Description', 'Image', 'Rating', 'Incventory Status', 'Category', 'Price', 'Quantity', 'ID', 'CheckBox'],
    };

    new ngxCsv(this.showData, 'product list', options);
  }
}
