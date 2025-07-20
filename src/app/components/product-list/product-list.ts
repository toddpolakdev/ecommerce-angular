import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-table.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products = signal<Product[]>([]);

  constructor(private ProductService: ProductService) {}

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts() {
    this.ProductService.getProductList().subscribe({
      next: (data) => {
        console.log('data:', data);
        this.products.set(data);
        console.log('this.products', this.products);
      },
      error: (err) => {
        console.error('Error fetching products', err);
      },
    });
  }
}
