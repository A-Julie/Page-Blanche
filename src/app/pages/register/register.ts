import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  register: FormGroup;

  constructor(private fb: FormBuilder) {
    this.register = this.fb.group({
      pronoun: ['', Validators.required],
      nameProfil: ['', Validators.required],
      datebirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.register.valid) {
      console.log("Formulaire valide :", this.register.value);
      // ici tu peux envoyer les données à une API ou autre
    } else {
      console.log("Formulaire invalide !");
      this.register.markAllAsTouched(); // Pour afficher les erreurs
    }
  }
}
