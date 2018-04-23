import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { MenuApiProvider } from '../../providers/menu-api/menu-api';
import * as _ from 'lodash';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})

export class MenuPage {
  public categories = [];
  public totalPrice = 0;
  public products = []; 
  public queryText: string;
  private allCategories = [];
  
  constructor(
    private menuApi: MenuApiProvider,
    private loadingController: LoadingController) { }

  ionViewDidLoad() {

    let loading = this.loadingController.create({
      content: 'Chargement du contenu...'
    });

    loading.present().then(() => {
      this.menuApi.getLocalMenu().subscribe(
        data => {
          this.allCategories = data.categories;
          this.initProduct();
          loading.dismiss();
        },
        err => {
          console.error(err);
          loading.dismiss();
        });
    });
  }

  /**
   *  Add element quantity to product
   */
  initProduct(){
    _.forEach(this.allCategories, c => {
      _.forEach(c.products, p => {
        p.quantity = 0;
      });
    });
    this.categories = this.allCategories;
    console.log('**allCategories', this.allCategories);
  }

  /**
   *  find the matching product for seach
   */
  updateTeams(){
    let queryTextLower = this.queryText.toLocaleLowerCase();
    let filterProducts = [];
    _.forEach(this.allCategories, c => {
      let products = _.filter(c.products, t => (<any>t).name.toLocaleLowerCase().includes(queryTextLower));
      if (products.length){
        filterProducts.push({name: c.name, products: products});
      }
    });
    this.categories = filterProducts;
  }

  /**
   *  Add 1 do the product quantity
   * @param  
   * @param product 
   */
  addProductToCart($event, product){
    let price = product.price;
    if (product.tva && product.tva > 0){
      price += (product.price / product.tva);
    }
    this.totalPrice += price;
    product.quantity += 1;
    if (_.findIndex(this.products,  ['id', product.id]) === -1){
      this.products.push(product);
    }
  }

  /**
   * remove 1 to the product quantity
   * @param  
   * @param product
   */
  removeProductToCart($event, product){
    if (product.quantity === 1){
      let index = this.products.indexOf(product);
      if (index !== -1){
        this.products.splice(index, 1);
      }
    }
    let price = product.price;
    if (product.tva > 0){
      price += (product.price / product.tva);
    }
    product.quantity -= 1;
    this.totalPrice -= price;
  }
}