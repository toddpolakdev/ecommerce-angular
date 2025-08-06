import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ProductList } from './components/product-list/product-list';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ProductService } from './services/product.service';
import { ProductCategoryMenu } from './components/product-category-menu/product-category-menu';
import { Search } from './components/search/search';
import { ProductDetails } from './components/product-details/product-details';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Cart } from './components/cart/cart';
import { CartStatus } from './components/cart-status/cart-status';
import { CartDetails } from './components/cart-details/cart-details';
@NgModule({
  declarations: [App, ProductList, ProductCategoryMenu, Search, ProductDetails, Cart, CartStatus, CartDetails],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    ProductService,
  ],
  bootstrap: [App],
})
export class AppModule {}
