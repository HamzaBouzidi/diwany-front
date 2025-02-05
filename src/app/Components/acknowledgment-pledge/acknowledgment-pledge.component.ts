import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { jsPDF } from 'jspdf';
//import '../../../assets/fonts/arabfont.js'; // Import the converted font file
import { Router } from '@angular/router';

@Component({
  selector: 'app-acknowledgment-pledge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acknowledgment-pledge.component.html',
  styleUrls: ['./acknowledgment-pledge.component.css'],
})
export class AcknowledgmentPledgeComponent implements OnInit {
  name: string = '';
  nationalNumber: string = '';
  qualification: string = '';
  ref_emp: string = '';

  constructor(
    private userService: UserInfoService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken();
  }

  goToUploadPage(): void {
    this.router.navigate(['/dashboard/pledge-upload']);
  }

  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.ref_emp = decodedToken.ref_emp || '';
      this.getUserInfo();
    } else {
      console.error('Token is invalid or missing.');
    }
  }

  getUserInfo(): void {
    if (this.ref_emp) {
      this.userService.getUserInfo(this.ref_emp).subscribe(
        (response) => {
          this.name = response.nm || '';
          this.nationalNumber = response.rw || '';
          this.qualification = response.d1 || '';
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  generatePDF(): void {
    fetch('assets/fonts/arabfont.ttf')
      .then(response => response.arrayBuffer())
      .then(fontData => {
        // Convert ArrayBuffer to Base64
        // const base64Font = btoa(String.fromCharCode(...new Uint8Array(fontData)));
        const base64Font = btoa(
          new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );


        const doc = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
        });

        // Register and set the Arabic font
        doc.addFileToVFS("arabfont.ttf", base64Font);
        doc.addFont("arabfont.ttf", "arabfont", "Regular");
        doc.setFont("arabfont", "Regular");

        // Add Arabic text content
        doc.setFontSize(18);
        doc.text('إقرار وتعهد', 105, 20, { align: 'center' });

        // Add user information
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(12);
        doc.text(`الاسم: ${this.name}`, pageWidth - 20, 50, { align: 'right' });
        doc.text(`الرقم الوطني: ${this.nationalNumber}`, pageWidth - 20, 60, { align: 'right' });
        doc.text(`المؤهل العلمي: ${this.qualification}`, pageWidth - 20, 70, { align: 'right' });

        // Add declarations
        const declarations = [
          'أقر بأن جميع مؤهلاتي المقدمة من قبلي للديوان صحيحة، وأن جميع البيانات الواردة بها سليمة ولا يشوبها أي شائبة.',
          'أني لا أزاول أي عمل أخر وفقا للمادة رقم (30) من القانون رقم (19) لسنة 2013 بشأن إعادة تنظيم ديوان المحاسبة.',
          'أني اطلعت على قرار السيد رئيس الديوان رقم 422 لسنة 2013 بشأن اعتماد قواعد السلوك الوظيفي، وأتعهد بالالتزام بما ورد به وتحمل المسؤولية كاملة في حال ثبوت مخالفتي له.',
          'أني اطلعت على منشور السيد وكيل الديوان رقم (1) لسنة 2014 بشأن الحياد وأتعهد بأن التزم بما ورد به.',
        ];

        let yPosition = 85;
        doc.setFontSize(12);
        declarations.forEach((declaration) => {
          doc.text(declaration, pageWidth - 20, yPosition, { align: 'right', maxWidth: 160 });
          yPosition += 10;
        });

        // Add signature box
        if (yPosition + 40 > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          yPosition = 20;
        }
        doc.rect(20, yPosition + 10, 80, 30);
        doc.text('التوقيع:', 25, yPosition + 20, { align: 'right' });

        // Save the PDF
        doc.save('Acknowledgment-Pledge.pdf');
      })
      .catch(error => console.error('Error loading Arabic font:', error));
  }


  onSubmit(commitmentForm: NgForm): void {
    if (commitmentForm.valid) {
      this.generatePDF();
      commitmentForm.reset();
    } else {
      console.error('Form is invalid.');
    }
  }
}
