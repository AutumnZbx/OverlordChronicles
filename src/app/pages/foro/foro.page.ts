import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { SevicebdService } from 'src/app/services/sevicebd.service';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {

  post: any[] = [];

  constructor(private router: Router, private activedroute: ActivatedRoute, private bd:SevicebdService) { 
   }
    ngOnInit() {
      this.loadPosts();
    }

    loadPosts() {
      this.bd.getAllPosts().then(result => {
        this.post = [];
        for (let i = 0; i < result.rows.length; i++) {
          this.post.push(result.rows.item(i));
        }
      });
    }
  
    // Navigate to the Create Post page
    createPost() {
      this.router.navigate(['/crear-post']);
    }

    goToPost(post: any) {
      this.router.navigate(['/postejemplo', post]);
    }
  
  

}

