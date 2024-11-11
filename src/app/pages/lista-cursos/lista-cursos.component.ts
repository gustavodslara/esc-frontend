import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Self } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { EditarCursoModalComponent } from '../editar-curso-modal/editar-curso-modal.component';
import { environment } from '../../services/enviroment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    CommonModule,
    EditarCursoModalComponent,
    RouterOutlet,
    RouterModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './lista-cursos.component.html',
  styleUrl: './lista-cursos.component.scss',
})
export class ListaCursosComponent {
  editandoCurso = false;
  selectedEditStatus: any;
  selectedStatus: string = 'todos';
  selectedYear: string = 'todos';
  editando = false;
  isEditando: any;
  curso: any;
  editarCurso() {
    this.editandoCurso = true;
  }
  carregando = true;
  constructor(private http: HttpClient, private router: Router) {}
  apiUrl = environment.jsonServerUrl;
  listaCursos: any;
  listaCursosBackup: any;

  async ngOnInit() {
    this.carregarDados();
    this.filterAparecerTodos();
  }


  filterAparecerTodos() {
    this.selectedStatus = 'Todos';
  }

  idCursoSelecionado = '';

  newStatus() {
    this.os.status = 'em andamento';
    this.os.status = this.selectedEditStatus;
  }


  async carregarDados() {
    this.carregando = true;
    setTimeout(async () => {
      var res: any = await this.http
        .get(this.apiUrl+'../os', {
          headers: {
           
          },
        })
        .toPromise();
      if (res.length == 0) {
        return;
      }
      let list: [] = res;
      console.log('AQYU RESS');
      console.log(res);
      list.reverse();
      this.listaCursos = list;
      this.listaCursosBackup = list;
      console.log(this.listaCursos);
      console.log(this.listaCursosBackup);
      this.carregando = false;
    }, 100);
  }

  getUltimoId2() {
    console.log(this.listaCursos);
    console.log(this.listaCursos[0].id);
    console.log(this.listaCursos.length  > 0);
    return this.listaCursos.length  > 0 ? Number(this.listaCursos[0].id) + 1 : 1;
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

  getId(str: string) {
    const segments = str.split('/');
    return segments[segments.length - 1];
  }

  goToEdit(idCurso?: any, edit = false) {
    console.log('AQUIi');
    console.log(idCurso);
    let id = this.getId(idCurso);

    this.router.navigateByUrl('editar-curso/' + id + '/' + edit);
  }
  goToEditId(idCurso?: any, edit = false) {
    this.router.navigateByUrl('editar-curso/' + idCurso + '/' + edit);
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

  filterCursos(texto: String, string?: any) {
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
    console.log(this.apiUrl+'../os' + id);
    var res = await this.http
      .delete(`${this.apiUrl}../os/${id}`)
      .toPromise();
    this.carregando = true;
    setTimeout(() => {
      this.carregarDados();
      this.deletando = false;
      this.carregando = false;
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
    datasHorarios: [ { data: '', horaInicio: '', horaFim: ''}],
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
    coordenacaoApoioAcao: [''],
    coordenacaoApoioOperacional: [''],
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
    publicoPrevisto: '',
    objetivo:'',
    publicoAlvomr: '',
    linkinscricao: '',

  };


  getDataInicio(curso: any): string {
    return curso.datasHorarios?.length ? curso.datasHorarios[0].data : '';
  }
  
  getDataFim(curso: any): string {
    return curso.datasHorarios?.length ? curso.datasHorarios[curso.datasHorarios.length - 1].data : '';
  }


  criarDatas() {
    if (this.os.datasHorarios.length > 0) {
      const ultimoIndex = this.os.datasHorarios.length - 1;
      this.os.dataInicio = this.os.datasHorarios[ultimoIndex].data;
    }
  }

  


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
