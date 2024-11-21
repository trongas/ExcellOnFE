import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServicesPageService } from '../../services/services-page/services-page.service';
import { Service } from 'src/app/interfaces/service';
import { ServiceCharge } from 'src/app/interfaces/serviceCharge';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { ProfileService } from '../../services/profile/profile.service';
@Component({
  selector: 'app-services-pricing',
  templateUrl: './services-pricing.component.html',
  styleUrls: ['./services-pricing.component.css'],
  providers: [CurrencyPipe],
})
export class ServicesPricingComponent implements OnInit {
  services?: Service[];
  serviceCharges: { [serviceId: number]: ServiceCharge[] } = {};
  openTab: number = 1;
  token: string | null = localStorage.getItem('token');
  userProfile: any;
  userId: number | undefined;
  constructor(
    private servicesService: ServicesPageService,
    private cartService: CartService,
    private profileService: ProfileService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    initFlowbite();
    this.getService();

    if (this.token !== null) {
      this.profileService.GetProfileByJwt(this.token).subscribe(
        (response) => {
          this.userProfile = response.userProfile;
          // console.log(this.userProfile);
          // Lấy id từ userProfile
          this.userId = this.userProfile.id;
          // console.log("User ID:", this.userId);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      console.error('Token is null. Handle this case appropriately.');
    }
  }
  openServiceDetailForm(service: any): void {
    const dialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '850px',
      data: service,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getService();
    });
  }
  addToCart(clientId: number, serviceChargesId: number): void {
    this.cartService.addCart(clientId, serviceChargesId).subscribe(
      () => {
        this.cartService.updateCartTotal(clientId);
        this.toastr.success('Add to cart successfully!', 'Success');
      },
      (error) => {
        this.cartService.updateCartTotal(clientId);
        console.error(error);
        this.toastr.error('Add to cart error!', 'Error');
      }
    );
  }

  getService(): void {
    this.servicesService.getService().subscribe({
      next: (data) => {
        this.services = data;
        // Fetch service charges for each service
        for (const service of this.services ?? []) {
          this.getServiceCharges(service.serviceId);
        }
      },
      error: (e) => console.error(e),
    });
  }

  getServiceCharges(serviceId: number): void {
    // Check if service charges for this serviceId already exist
    if (!this.serviceCharges[serviceId]) {
      this.servicesService.getServiceChargeByServiceId(serviceId).subscribe({
        next: (data) => {
          // Store service charges in an object using serviceId as key
          this.serviceCharges[serviceId] = data;
          // console.log(serviceId);
        },
        error: (e) => console.error(e),
      });
    }
  }

  imageService = [
    {
      imageSrc: '../../../assets/images/special_services02.svg',
      altText: 'Services',
    },
    {
      imageSrc: '../../../assets/images/special_services04.svg',
      altText: 'Services',
    },
    {
      imageSrc: '../../../assets/images/special_services06.svg',
      altText: 'Services',
    },
    {
      imageSrc: '../../../assets/images/special_services03.svg',
      altText: 'Services',
    },
    {
      imageSrc: '../../../assets/images/special_services05.svg',
      altText: 'Services',
    },
    {
      imageSrc: '../../../assets/images/special_services01.svg',
      altText: 'Services',
    },
  ];
  reviewService: string[] = [
    'Solve economic problems',
    'IT Security Services',
    'Expertise and Experience',
    'Practice Management',
    'Diverse Range of Services',
    'Exceptional Customer Service',
  ];

  tabs = [
    {
      id: 1,
      title: 'In-bound Services',
      strengths: [
        {
          icon: '/assets/images/check-all.svg',
          description:
            'No one wants to be bothered by marketers, or bothered by salespeople. They just want to get help.',
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'Share relevant information, create useful content, and satisfy needs clients.',
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'By publishing the right content, in the right place, Inbound Marketing creates real value for customers.',
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'They will trust and love the business more because they receive valuable information.',
        },
      ],
      advantages:
        'What are the advantages of the Inbound Marketing method? No need for expensive advertising, Inbound Marketing will guide potential customers to proactively search for businesses through Google, blogs or social networks. By publishing the right content, in the right place and at the right time, Inbound Marketing creates real value for customers.',
      stages: 'Learn the 5 stages of Inbound Marketing:',
      marketingStages: [
        'Attract visitors to the website',
        'Transformation',
        'Marketing automation',
        'Brand loyalty',
        'Check progress and measure results',
      ],
      types: 'Types of Inbound Marketing:',
      marketingTypes: [
        'Content Marketing',
        'SEO',
        'Social Media Marketing',
        'Email Marketing',
        'Search Engine Marketing (SEM)',
      ],
      importance:
        "It can be said that Inbound Marketing is a long-term investment, requiring attracting, establishing and nurturing potential customers instead of chasing immediate profits. That's why many Vietnamese businesses are still hesitant to leave their comfort zone to join the Inbound Marketing trend.",
      importancePoints: [
        'Helps businesses collect customer information and process information quickly.',
        'Is the department that helps businesses answer questions and respond to requests and suggestions from customers.',
        'It is an effective communication channel for businesses to spread their brand in the market.',
        'Helps businesses build positive relationships with customers, increase customer interaction while minimizing business risks.',
      ],
    },
    {
      id: 2,
      title: 'Out-bound Services',
      strengths: [
        {
          icon: '/assets/images/check-all.svg',
          description:
            "Actively promote your brand's message to your target audience.",
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'Outbound Marketing includes different Marketing strategies and techniques that target a wide range of users.',
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'Outbound Marketing offers the ability to set targeting limits based on many factors.',
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'The budget for this type of campaign is planned from the beginning, which simplifies tracking.',
        },
      ],
      advantages: 'Advantages of using Outbound Marketing:',
      stages: 'Popular types of Outbound Marketing:',
      marketingStages: [
        'Traditional advertising',
        'Digital Ads',
        'Cold Calling',
      ],
      types: 'Popular types of Outbound Marketing:',
      marketingTypes: [
        'Traditional advertising',
        'Digital Ads',
        'Cold Calling',
      ],
      importance:
        'Outbound Marketing may have played a very important role in the past. However, along with the development of the Internet, the shift from traditional forms of Marketing to Inbound Marketing is considered inevitable.',
      importancePoints: [
        'One of the most valuable aspects of Outbound Marketing is its ability to reach a target.',
        'Outbound Marketing offers the ability to set targeting limits based on many factors.',
        'Outbound Marketing is also relatively easy to measure effectiveness.',
        'Online outbound marketing is a popular method for generating leads.',
      ],
    },
    {
      id: 3,
      title: 'Tele Marketing Services',
      strengths: [
        {
          icon: '/assets/images/check-all.svg',
          description: 'Telemarketing simply means marketing via telephone.',
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'Telemarketing includes introducing and providing information about products to customers.',
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'Service with the purpose of creating demand for potential customers and collecting information.',
        },
        {
          icon: '/assets/images/check-all.svg',
          description:
            'Is a solution that helps businesses collect and process customer information quickly.',
        },
      ],
      types: 'Types of Telemarketing:',
      marketingTypes: ['Inbound Telemarketing', 'Outbound Telemarketing'],
      importance: 'The importance of Telemarketing in businesses:',
      importancePoints: [
        'Helps businesses collect customer information and process information quickly.',
        'Is the department that helps businesses answer questions and respond to requests and suggestions from customers.',
        'It is an effective communication channel for businesses to spread their brand in the market.',
        'Helps businesses build positive relationships with customers, increase customer interaction while minimizing business risks.',
      ],
    },
  ];
}
