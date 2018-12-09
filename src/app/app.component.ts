import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debug } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'product-compare';
  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    this.getData();
  }
  public productList: Array<any> = [];
  public selectedProducts: Array<any> = [];
  public copyOfSelectedArray: Array<any> = [];
  public productListLeft: Array<any> = [];
  public originalObject: any;
  public clickedCheckBox: boolean = false;
  public removedProduct: boolean = false;

  private getData(): void {
    this.http.get("http://demo9176653.mockable.io/products").subscribe(result => {
      result = typeof result == 'string' ? JSON.parse(result) : result;
      if (result) {
        this.originalObject = result;
        var arr = [];
        for (var key in result['products']['compareSummary']['productPricingSummary']) {
          arr.push({ prodId: key })
        }

        arr.forEach(el => {
          el['image'] = result['products']['compareSummary']['images'][el['prodId']];
          el['productPricing'] = result['products']['compareSummary']['productPricingSummary'][el['prodId']];
          el['title'] = result['products']['compareSummary']['titles'][el['prodId']];
          el['featureList'] = [];
          result['products']['featuresList'].forEach((element, ind) => {
            el['featureList'].push({ 'featureName': element['title'], featureDetails: [] });
            element['features'].forEach(elem => {
              el['featureList'][ind]['featureDetails'].push({ featureName: elem['featureName'], value: elem['values'][el['prodId']] })
            });

          });
        })
        this.productList = arr;
      }
      this.selectedProducts.push(this.productList[0]);

      this.productList.forEach((el, count) => {
        if (count < 2)
          this.selectedProducts.push(el);
        else
          this.productListLeft.push(el);
      })
      this.selectedProducts = JSON.parse(JSON.stringify(this.selectedProducts));
      console.log(this.selectedProducts);

    });
  }

  public removeThisProduct(prod, index): void {
    if (this.clickedCheckBox) {
      alert('Please unselect Show only differences button.');
      return;
    } else if (this.removedProduct) {
      alert('Please enter another product to remove this.');
      return;
    }
    this.removedProduct = true;
    this.selectedProducts[index] = [];
    this.productListLeft.push(prod);
  }

  public addThisProduct(index, prod): void {
    if (this.clickedCheckBox) {
      alert('Please unselect Show only differences button.');
      return;
    }
    this.removedProduct = false;
    this.productListLeft.forEach((obj, position) => {
      if (obj['prodId'] == prod) {
        this.selectedProducts[index] = obj;
        this.productListLeft.splice(position, 1);
      }
    })
  }

  public checkBoxClicked(): void {
    this.clickedCheckBox = !this.clickedCheckBox;
    if (this.clickedCheckBox) {
      this.copyOfSelectedArray = JSON.parse(JSON.stringify(this.selectedProducts));
      this.compare();
    } else {
      if (this.copyOfSelectedArray.length > 0)
        this.selectedProducts = this.copyOfSelectedArray;
    }
  }

  public compare(): void {
    for (var i = 0; i < this.selectedProducts[0]['featureList'].length; i++) {

      for (var j = 0; j < this.selectedProducts[0]['featureList'][i]['featureDetails'].length; j++) {
        console.log(j);
        if (this.selectedProducts[1]['featureList'][i]['featureDetails'][j]['value']
          == this.selectedProducts[2]['featureList'][i]['featureDetails'][j]['value']) {

          this.selectedProducts[2]['featureList'][i]['featureDetails'].splice(j, 1);
          this.selectedProducts[1]['featureList'][i]['featureDetails'].splice(j, 1);
          this.selectedProducts[0]['featureList'][i]['featureDetails'].splice(j, 1);
          j = j - 1;
        }
      }
    }
  }
}
