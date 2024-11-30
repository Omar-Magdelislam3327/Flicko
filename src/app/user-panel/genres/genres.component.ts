import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavButton } from 'ngx-owl-carousel-o/lib/models/navigation-data.models';
import { GenresApiService } from 'src/app/controllers/genres-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css']
})
export class GenresComponent {
  genres!: any;
  sessionId: string;
  customOptions: any = {
    loop: true,
    margin: 10,
    nav: true,
    navText: ['<', '>'],
    navClass: ['custom-nav-left', 'custom-nav-right'],
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    drag: true,
    responsiveClass: true,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 5
      }
    }
  };


  constructor(private api: GenresApiService, private router: Router) {
    this.sessionId = localStorage.getItem('session_id') || '';

    if (!this.sessionId) {
      this.router.navigate(['/login']);

    }
    this.api.getGenres().subscribe((data: any) => {
      this.genres = data.genres.map((g: any) => {
        return {
          ...g,
          imageUrl: this.genreImages[g.id] || 'https://via.placeholder.com/150'
        };
      });
      console.log(this.genres);
    });
  }

  readonly genreImages: { [id: number]: string } = {
    28: 'https://i0.wp.com/thegameofnerds.com/wp-content/uploads/2021/06/Walker-3.png?resize=1280%2C640&ssl=1%27',
    12: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/06/jumanji2.jpg?q=50&fit=crop&w=1100&h=618&dpr=1.5%27',
    35: 'https://www.intofilm.org/intofilm-production/scaledcropped/444x250https%3A/s3-eu-west-1.amazonaws.com/images.cdn.filmclub.org/film__4103-rush-hour--hi_res-9e180d2e.jpg/film__4103-rush-hour--hi_res-9e180d2e.jpg',
    18: 'https://compote.slate.com/images/3c93eded-581a-43c6-ba9d-596af8eabe8e.jpeg?crop=1100%2C733%2Cx0%2Cy0&width=1280%27',
    80: 'https://imageio.forbes.com/specials-images/imageserve/65480fb49aafcdd8f056887a/Seven-547486671-large/960x0.png?format=png&width=1440%27',
    27: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/09/lorraine-warren-and-all-the-evil-spirits-in-the-conjuring-franchise.jpg?q=50&fit=crop&w=1100&h=618&dpr=1.5%27',
    9648: 'https://variety.com/wp-content/uploads/2016/10/sherlock-holmes.jpg?w=1000&h=562&crop=1%27',
    10749: 'https://variety.com/wp-content/uploads/2020/02/all-the-bright-places.jpg?w=1000&h=667&crop=1%27',
    53: "https://assets.mubicdn.net/images/film/26320/image-w1280.jpg?1546556409%27",
    16: "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/25528394/INSIDE_OUT_2_ONLINE_USE_i140_15mT_pub.pub16.1581.jpg?quality=90&strip=all&crop=18.603515625%2C0%2C62.79296875%2C100&w=828%27",
    10752: "https://static01.nyt.com/images/2014/08/03/arts/03FURY/03FURY-jumbo.jpg?quality=75&auto=webp%27",
    10402: "https://vid.alarabiya.net/images/2017/02/13/c8c80b8c-824c-470d-86d8-edac45fe9933/c8c80b8c-824c-470d-86d8-edac45fe9933.png?crop=4:3&width=1200%27",
    37: "https://m.media-amazon.com/images/M/MV5BNWE3N2E3YzQtNzdlMy00NzBmLWE3NmQtYTExYmIzYmZiMGE5XkEyXkFqcGdeQVRoaXJkUGFydHlJbmdlc3Rpb25Xb3JrZmxvdw@@",
    878: "https://edgroom-blogs.s3.ap-south-1.amazonaws.com/202310071805064792540_38983_u23h.jpg",
    10751: "https://cdn.arageek.com/magazine/2020/07/%D8%A7%D9%84%D8%B3%D8%B9%D9%8A-%D9%88%D8%B1%D8%A7%D8%A1-%D8%A7%D9%84%D8%B3%D8%B9%D8%A7%D8%AF%D8%A9-2.jpg",
    99: "https://cdn.theplaylist.net/wp-content/uploads/2023/06/26104935/Stephen-curry-underrated.jpg",
    36: "https://duet-cdn.vox-cdn.com/thumbor/0x0:2233x1022/640x640/filters:focal(1064x460:1065x461):format(webp)/cdn.vox-cdn.com/uploads/chorus_asset/file/24796653/OPR_Tsr1Sht4_RGB_2.jpeg",
    14: "https://cdn.mos.cms.futurecdn.net/NgKvu8G2coskQXj74MoKcE-650-80.jpg.webp",
    10770: "https://m.media-amazon.com/images/M/MV5BMTQxNDM2MDMwMl5BMl5BanBnXkFtZTcwODA1ODA3MQ@@._V1_.jpg"
  };
}
