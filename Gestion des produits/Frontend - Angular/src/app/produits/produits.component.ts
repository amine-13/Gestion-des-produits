import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CatalogueService} from '../services/catalogue.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
public produits;
public size:number=5;
public currentpage:number=0;
public totalPages:number;
public pages:Array<number>;
  private currentKeyword: string="";


  constructor(private catServices:CatalogueService,private router:Router) { }

  ngOnInit(): void {

  }

  onGetProducts() {
this.catServices.getProducts(this.currentpage,this.size)
  .subscribe(data=>{
    this.totalPages=data["page"].totalPages;
    this.pages=new Array<number>(this.totalPages);
    this.produits=data;
    },err=>{
    console.log(err);
    })
  }

  onPageProduct(i: number) {
    this.currentpage=i;
    this.chercherProduit() ;
  }
  onChercher(form: any) {
    this.currentpage=0;
    this.currentKeyword=form.keyword;
    this.chercherProduit();
  }

   chercherProduit() {
    this.catServices.getProductsByKeyword(this.currentKeyword,this.currentpage,this.size)
      .subscribe(data=>{
        this.totalPages=data["page"].totalPages;
        this.pages=new Array<number>(this.totalPages);
        this.produits=data;
      },err=>{
        console.log(err);
      })
  }

  onDeleteProduct(p) {
let conf=confirm("Etes vous sure?");
 if (conf)
   this.catServices.deleteResource(p._links.self.href)
     .subscribe(data=>
     {
       this.chercherProduit();
     },error => {
       console.log(error);
     });}

  onEditProduct(p) {
    let url=p._links.self.href;
this.router.navigateByUrl("/edit-product/"+btoa(url));
  }
}
