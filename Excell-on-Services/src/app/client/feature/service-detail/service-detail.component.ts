import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  serviceDetailForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ServiceDetailComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  
    this.serviceDetailForm = this.formBuilder.group({
      imageService: [this.imageService[0].imageSrc, Validators.required],
      serviceName: [this.data?.serviceName, Validators.required ],
      description: [this.data?.description, Validators.required ],
      totalDay: [this.data?.totalDay, Validators.required],
     
    });
  }
  imageService = [
    { imageSrc: '../../../assets/images/InBound.gif', altText: 'In-Bound' },
    { imageSrc: '../../../assets/images/teleSale.gif', altText: 'Out-Bound' },
    { imageSrc: '../../../assets/images/OutBound.gif', altText: 'Tele Sale' },   
    { imageSrc: '../../../assets/images/InBound.gif', altText: 'In-Bound' },
    { imageSrc: '../../../assets/images/teleSale.gif', altText: 'Out-Bound' },
    { imageSrc: '../../../assets/images/OutBound.gif', altText: 'Tele Sale' },   
  ];
  
}
