import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  customers = [
    { imageSrc: '../../../assets/images/Customer1.jpg', altText: 'Customer 1' },
    { imageSrc: '../../../assets/images/Customer2.jpg', altText: 'Customer 2' },
    { imageSrc: '../../../assets/images/Customer3.jpg', altText: 'Customer 3' },
    { imageSrc: '../../../assets/images/Customer4.jpg', altText: 'Customer 4' },
    { imageSrc: '../../../assets/images/Customer5.jpg', altText: 'Customer 5' },
    { imageSrc: '../../../assets/images/Customer6.jpg', altText: 'Customer 6' },
    { imageSrc: '../../../assets/images/Customer7.jpg', altText: 'Customer 7' },
    { imageSrc: '../../../assets/images/Customer8.jpg', altText: 'Customer 8' },
    { imageSrc: '../../../assets/images/Customer9.jpg', altText: 'Customer 9' },
    {
      imageSrc: '../../../assets/images/Customer10.jpg',
      altText: 'Customer 10',
    },
  ];

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  private initSwiper(): void {
    const swiperEl = this.swiperContainer.nativeElement;

    const swiperParams = {
      slidesPerView: 1,
      breakpoints: {
        1200: {
          slidesPerView: 6,
        },
        992: {
          slidesPerView: 4,
        },
        450: {
          slidesPerView: 3,
        },
        0: {
          slidesPerView: 2,
        },
      },
      on: {
        init() {
          // Additional initialization logic if needed
        },
      },
    };

    new Swiper(swiperEl, swiperParams);
  }
}
