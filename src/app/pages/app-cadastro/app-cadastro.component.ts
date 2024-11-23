import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './app-cadastro.component.html',
  styleUrls: ['./app-cadastro.component.scss'],
  imports: [NavbarComponent, CommonModule, FormsModule],
})
export class AppCadastroComponent implements OnInit {
  studentList: any[] = [];
  selectedCourse: string = 'Todos';
  selectedYear: string = 'todos';
  searchText: string = '';
  loading: boolean = false;

  constructor() { }

  ngOnInit() {
    // Inicialização dos dados de estudantes
    this.loadStudents();
  }

  loadStudents() {
    // Função para carregar a lista de estudantes (substituir com chamada à API se necessário)
    this.studentList = [
      { id: 1, name: 'John Doe', course: 'Curso 1', confirmationDate: new Date(), confirmed: true },
      { id: 2, name: 'Jane Doe', course: 'Curso 2', confirmationDate: new Date(), confirmed: false },
      // Adicione mais estudantes conforme necessário
    ];
  }

  filterStudents(course: string) {
    // Função para filtrar estudantes por curso
  }

  searchStudent(text: string) {
    // Função para pesquisar estudantes por nome
  }

  sortStudents(by: string) {
    // Função para ordenar estudantes por campo
  }
}

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    CommonModule, // Adicionando CommonModule para garantir a funcionalidade dos pipes
    FormsModule
  ],
  bootstrap: [AppCadastroComponent]
})
export class AppModule { }
