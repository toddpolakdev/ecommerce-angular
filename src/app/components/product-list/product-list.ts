import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products = signal<Product[] | null>(null);
  currentCateogyId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string = '';

  constructor(
    private ProductService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  private processResult() {
    return {
      next: (data: any) => {
        this.products.set(data._embedded.products);
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      },
    };
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if keyword is different than previous set thePageNumber to 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.ProductService.searchProductsPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      theKeyword
    ).subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string, convert string to a number using the "+" symbol
      this.currentCateogyId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // default to 1
      this.currentCateogyId = 1;
    }

    // check if we have a different category than previous
    // if so, reset the page number
    if (this.previousCategoryId != this.currentCateogyId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCateogyId;
    console.log(
      `currentCategoryId=${this.currentCateogyId}, thePageNumber=${this.thePageNumber}`
    );

    this.ProductService.getProductListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.currentCateogyId
    ).subscribe(this.processResult());
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
