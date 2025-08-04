import { Component, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  product = signal<Product | null>(null);

  constructor(
    private ProductService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }
  handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.ProductService.getProduct(theProductId).subscribe({
      next: (data) => {
        this.product.set(data);
      },
      error: (err) => {
        console.error('Error fetching product', err);
      },
    });
  }

  addToCart() {
    console.log(
      `Adding to cart: ${this.product()!.name}, ${this.product()!.unitPrice}`
    );

    const theCartItem = new CartItem(this.product()!);

    this.cartService.addToCart(theCartItem);
  }
}
