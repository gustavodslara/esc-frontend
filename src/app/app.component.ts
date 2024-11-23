import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { EditarCursoModalComponent } from './pages/editar-curso-modal/editar-curso-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppLoginComponent } from './pages/app-login/app-login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule, EditarCursoModalComponent, NavbarComponent,AppLoginComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  editandoCurso = false;
  selectedStatus: string = 'todos';
  selectedYear: string = 'todos';
  editando = false;
  isEditando: any;
  editarCurso() {
    this.editandoCurso = true;
  }
  carregando = true;
  constructor(private http: HttpClient, private router: Router) {}

  listaCursos: any;
  listaCursosBackup: any;

  async ngOnInit() {
    this.carregarDados();
  }
  idCursoSelecionado = '';

  async carregarDados() {
    this.carregando = true;
    setTimeout(async () => {
      var res: any = await this.http
        .get('http://25.1.80.110:3000/listaCursos')
        .toPromise();
      let list: [] = res;
      list.reverse();
      this.listaCursos = list;
      this.listaCursosBackup = list;
      this.carregando = false;
    }, 500);
  }

  getUltimoId() {
    let ultimoId = Number(this.listaCursos[0].id);
    return ultimoId + 1;
  }

  title = 'cursos';

  courseIdToDelete = '';
  nextCourseNumber = 1;
  excluirCurso = false;

  openModal(courseId: any) {
    this.courseIdToDelete = courseId;
    const modal = document.getElementById('modal');
  }
  modalVisivel = false;
  openAddModal() {
    this.numeroCurso = '';
    this.nomeCurso = '';
    this.statusCurso = '';
    this.dataInicio = '';
    this.dataTermino = '';
    this.modalVisivel = true;
  }

  goToEdit(idCurso?: number) {
    if (idCurso != null && idCurso != undefined) {
      this.router.navigateByUrl('editar-curso/' + idCurso);
    } else {
      this.router.navigateByUrl('editar-curso');
    }
  }

  closeModal() {
    this.modalVisivel = false;
    this.editando = false;
  }

  closeAddModal() {
    this.modalVisivel = false;
  }

  deletando = false;

  deleteCourse() {
    if (this.courseIdToDelete) {
      const courseElement = document.getElementById(this.courseIdToDelete);
      if (courseElement) {
        courseElement.remove();
      }
    }
    setTimeout(() => {
      this.carregarDados();
      this.deletando = false;
    }, 1000);
  }

  numeroCurso = '';
  nomeCurso = '';
  dataInicio = '';
  dataTermino = '';
  statusCurso = '';

  pesquisarCurso(texto: string) {
    this.listaCursos = this.listaCursosBackup;
    let cursosFiltrados = this.listaCursos.filter(
      (curso: { tituloEvento: string }) =>
        curso.tituloEvento.toLowerCase().includes(texto.toLowerCase())
    );
    this.listaCursos = cursosFiltrados;
  }

  textoPesquisa = '';

  sortCursos(attribute: string) {
    this.listaCursos = this.listaCursosBackup;
    this.listaCursos.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) => {
        if (a[attribute] < b[attribute]) {
          return -1;
        } else if (a[attribute] > b[attribute]) {
          return 1;
        } else {
          return 0;
        }
      }
    );
  }

  filterCursos(texto: String) {
    this.listaCursos = this.listaCursosBackup;

    if (this.selectedStatus != 'Todos') {
      let cursosFiltrados = this.listaCursos.filter(
        (curso: { status: string }) =>
          curso.status.toLowerCase().includes(texto.toLowerCase())
      );

      this.listaCursos = cursosFiltrados;
    }

    if (this.selectedYear != 'Todos') {
      let cursosFiltrados = this.listaCursos.filter(
        (curso: { dataInicio: string | number | Date }) => {
          curso.dataInicio;
          this.listaCursos = cursosFiltrados;
        }
      );
    }
  }

  async deletaCurso(id: any) {
    this.carregando = true;
    console.log(`http://25.1.80.110:3000/listaCursos/` + id);
    var res = await this.http
      .delete(`http://25.1.80.110:3000/listaCursos/${id}`)
      .toPromise();
    setTimeout(() => {
      this.carregarDados();
      this.carregando = true;
      this.deletando = false;
    }, 600);
  }
  fecharModal() {
    this.editando = false;
    this.modalVisivel = false;
  }

  modalStatusVisivel = false;
  cursoSelecionado: any = {};

  abrirModalStatus() {
    this.os.status = this.selectedStatus;
    //this.cursoSelecionado = curso.status;
    this.modalStatusVisivel = true;
  }

  fecharModalStatus() {
    this.modalStatusVisivel = false;
  }

  os = {
    id: '',
    unidadeSolicitante: '',
    tituloEvento: '',
    dataInicio: '',
    horaInicio: '',
    dataFim: '',
    horaFim: '',
    quantidadeParticipantes: '',
    modalidade: '', // Dropdown com opções predefinidas
    cargaHoraria: '',
    demanda: '', // Dropdown com opções predefinidas
    coordenadorGeral: '', // Dropdown com opções predefinidas
    coordenadorApoioInstitucional: '', // Dropdown com opções predefinidas
    coordenadorAcaoCapacitacao: '',
    coordenacaoApoioAcao: '',
    coordenacaoApoioOperacional: '',
    equipeTecnica: '',
    equipeTecnica2: '',
    equipeTecnica3: '',
    equipeTecnica4: '',
    equipeJuridica: '',
    observacao: '',
    osElaboradaPor: '',
    local: '',
    publicoAlvo: '',
    status: '',
  };

  sinalizaReloadPage() {
    this.carregarDados();
  }

  async confirmAddCourse() {
    // if (this.numeroCurso && this.nomeCurso && this.dataInicio && this.dataTermino && statusCurso) {
    //   const cursosAdicionados = document.getElementById('cursos-adicionados');
    //   const formattedDataInicio = new Date(this.dataInicio).toLocaleDateString(
    //     'pt-BR'
    //   );
    //   const formattedDataTermino = new Date(this.dataTermino).toLocaleDateString(
    //     'pt-BR'
    //   );
    //   const novoCurso = `
    //             <div class="course-card" id="curso-${this.numeroCurso}">
    //                 <span class="course-number">${this.numeroCurso}.</span>
    //                 <span class="dot ${this.statusCurso}"></span>
    //                 <span class="status">${
    //                   this.statusCurso === 'andamento'
    //                     ? 'Em andamento'
    //                     : this.statusCurso.charAt(0).toUpperCase() +
    //                       this.statusCurso.slice(1)
    //                 }</span>
    //                 <span class="course-name">${this.nomeCurso}</span>
    //                 <span class="course-dates">${formattedDataInicio} - ${formattedDataTermino}</span>
    //                 <a href="#" class="edit-link">Editar</a>
    //                 <a href="#" class="delete-link" onclick="openModal('curso-${this.numeroCurso}')">x</a>
    //             </div>
    //         `;
    //   cursosAdicionados.insertAdjacentHTML('afterbegin', novoCurso);
    //   // Incrementa o número do próximo curso automaticamente
    //   this.nextCourseNumber = parseInt(this.numeroCurso) + 1;
    //   this.closeAddModal();
    // } else {
    //   alert('Por favor, preencha todos os campos para adicionar o curso.');
    // }
  }
  
}

