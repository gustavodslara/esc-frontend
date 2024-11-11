import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MenuDocsComponent } from '../../components/menu-docs/menu-docs.component';
import { WebsocketService } from '../../services/websocket.service';
import { saveAs } from 'file-saver';
import { environment } from '../../services/enviroment';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editar-curso-modal',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    CommonModule,
    EditarCursoModalComponent,
    MenuDocsComponent,
    NavbarComponent,
    ToastrModule,
  ],
  templateUrl: './editar-curso-modal.component.html',
  styleUrl: './editar-curso-modal.component.scss',
})
export class EditarCursoModalComponent {
  selectedStatus: any;
  selectedEditStatus: any;
  exibirCurso: any = false;
  curso: any;
  closeAddModal() { }

  exibirMenuOS = true;
  exibirMenuTR = true;
  exibirMenuMR = true;
  exibirMenuRF = true;

  faseAtual = 0;

  async ngOnInit() {
    this.carregando = true;
    this.route.params.subscribe((params) => {
      this.idCurso = params['idCurso'];
      this.isEditando = params['isEditando'] === 'true' ? true : false;
      this.os.id = this.idCurso + '';
      console.log(this.idCurso);
      console.log(this.isEditando);
    });
    if (this.isEditando != undefined && this.isEditando == true) {
      console.log(this.isEditando);
      setTimeout(async () => {
        await this.carregarDadoCursoEditando();
        this.carregando = false;
      }, 650);
    } else {
      this.carregando = false;

    }
    this.os.id = this.idCurso + '';


    this.authService.isLoggedUser$.subscribe((isLoggedUser) => {
      this.isLoggedUser = isLoggedUser;
      console.log(isLoggedUser);
    });
    this.user = await this.authService.getUser(this.isLoggedUser);
    this.isDisabled = this.user.isCoordenador == true || this.user.isEstagiario == true ? false : true;
    console.log("teeasdasda");
    console.log(this.isDisabled);

  }
  isLoggedUser = "";
  user: any = {};
  apiUrl = environment.jsonServerUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private websocketService: WebsocketService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  isEditando: boolean | undefined;
  @Input() idCurso: any;
  @Output() fecharModal = new EventEmitter<void>();
  @Output() NumeroOS: Boolean = false;
  @Output() sinalizaReloadPage = new EventEmitter<void>();

  trId: any;

  sendNovaOsMessage(id: number, nomeCurso: string, etc: string) {
    const message = `Nova OS, id:${id},${nomeCurso}, etc:${etc}`;
    this.websocketService.sendMessage(message);
  }

  async carregarDadoCursoEditando() {
    if (this.isEditando) {
      let res: any = await this.http
        .get(this.apiUrl + '/os/' + this.idCurso)
        .toPromise();
      this.os = res;

      if (this.os.idTr != undefined && this.os.idTr != null && this.os.idTr.length > 0) {
        console.log('IHA');
        console.log(this.os.tr);
        console.log(this.os);
        let trr: any = this.os.tr;
        this.trId = this.os.idTr;
        let res2: any = await this.http
          .get(this.apiUrl + '/tr/' + this.trId)
          .toPromise();
        this.termoRecisao = res2;
      } else {
        console.log('IHA2');
        console.log(this.os.tr);
        console.log(this.os);
        this.trId = null;
      }

      console.log(this.os);
      let equipeT = this.os.equipeTecnica;
      if (equipeT != undefined && equipeT != null && equipeT.length > 0) {
        this.equip1 = equipeT.includes('Criar Link');
        this.equip2 = equipeT.includes('Elaborar e encaminhar avaliação');
        this.equip3 = equipeT.includes('Emitir Certificado');
        this.equip4 = equipeT.includes('Emitir Relatório Final');
      }
      this.termoRecisao = res.tr === undefined ? this.termoRecisao : res.tr;
    }
  }

  carregando = false;
  recarregaPagina() {
    setTimeout(() => {
      this.carregando = true;
    }, 700);
    this.carregando = false;
  }

  // Método para fechar o modal
  fechar() {
    this.router.navigateByUrl('lista-cursos');
  }

  addField() {
    // this.os.equipeJuridica = [''].concat(this.os.equipeJuridica);
  }

  equip1 = false;
  equip2 = false;
  equip3 = false;
  equip4 = false;

  termoRecisao = {
    esc: '',
    categoria: '',
    anexo: '',
    objeto: '',
    justificativa: '',
    modalidadeLicitacao: '',
    investimento: '',
    especificacoes: '',
    ementa: '',
    obrigacoesContratante: '',
    obrigacoesContratada: '',
    sancoes: '',
    dotacaoOrcamentaria: '',
    condicoesPagamento: '',
    documentosRegularidade: '',
    contrato: '',
    acompanhamento: '',
    nomeAssinante: '',
    cargoAssinante: '',
    id: '', // some number
    modalidade: '', // from Curso class
  };

  voltar() {
    this.router.navigateByUrl('lista-cursos');
  }

  exibirTr = false;
  exibirOs = true;

  proximaPagina() {
    this.exibirTr = !this.exibirTr;
    this.exibirOs = !this.exibirOs;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  scrollUp() {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  proximaPaginaOs() {
    this.exibirOs = !this.exibirOs;
    this.exibirTr = !this.exibirTr;
    this.faseAtual = this.faseAtual == 0 ? 1 : 0;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // changePositionCondition:boolean = false;

  //async changePositionDocPrint (
  //  if(this.imprimir) {

  //  }
  //)

  tess() {
    console.log(this.equip1);
  }

  public async salvaCurso() {

    let os: any = this.os;


    this.carregando = true;
    if (this.equip1) {
      os.equipeTecnica.push('Criar link');
    }
    if (this.equip2) {
      os.equipeTecnica.push('Elaborar e encaminhar avaliação');
    }
    if (this.equip3) {
      os.equipeTecnica.push('Emitir Certificado');
    }
    if (this.equip4) {
      os.equipeTecnica.push('Emitir Relatório Final');
    }
    os.modalidade = os.modalidade.length > 0 ? os.modalidade : 'NENHUM';
    os.demanda = os.demanda.length > 0 ? os.demanda : 'OUTRA_DEMANDA';
    if (this.trId != null) {
      os.idTr = this.trId;
    }
    if (this.isEditando) {
      var res = await this.http
        .put(this.apiUrl + '/os/' + this.idCurso, os)
        .toPromise();
      this.sendNovaOsMessage(this.idCurso, os.tituloEvento, 'OS');
    } else {
      var res = await this.http
        .post(this.apiUrl + '/os', os)
        .toPromise();
      this.sendNovaOsMessage(this.idCurso, os.tituloEvento, 'OS');
    }
    await setTimeout(() => {
      this.carregando = false;
    }, 350);
  }

  public async salvaTr() {
    let tr: any = this.termoRecisao;

    console.log('SOC');
    console.log(tr);
    console.log(this.trId);
    this.carregando = true;
    tr.modalidade = (tr.modalidade != undefined && tr.modalidade != null && tr.modalidade.length > 0) ? tr.modalidade : 'NENHUM';
    tr.idOs = this.idCurso;
    tr.id = this.idCurso;
    this.os.idTr = tr.id;
    this.salvaCurso();
    if (this.trId != null) {
      var res = await this.http
        .put(this.apiUrl + '/tr/' + this.trId, tr)
        .toPromise();
      this.sendNovaOsMessage(tr.id, tr.esc, 'TR');
    } else {
      var res = await this.http
        .post(this.apiUrl + '/tr', tr)
        .toPromise();
      this.sendNovaOsMessage(tr.id, tr.esc, 'TR');
    }
    await setTimeout(() => {
      this.carregando = false;
    }, 350);
  }

  newStatus() {
    this.os.status = 'AGENDADO';
    this.os.status = this.selectedEditStatus;
  }

  os = {
    idTr: '',
    id: '0',
    unidadeSolicitante: '',
    tituloEvento: '',
    dataInicio: '', // Should be a valid date format (e.g., '2024-10-06')
    horaInicio: '', // Should be a valid time format (e.g., '09:00')
    dataFim: '', // Should be a valid date format
    horaFim: '', // Should be a valid time format
    quantidadeParticipantes: '', // Integer value
    modalidade: 'NENHUM', // Dropdown with predefined options
    cargaHoraria: '', // Integer value
    demanda: '', // Dropdown with predefined options
    coordenadorGeral: 'Marco José da Silva', // Dropdown with predefined options
    coordenadorApoioInstitucional: 'Carlos Arantes', // Dropdown with predefined options
    coordenadorAcaoCapacitacao: 'Selecionar',
    coordenacaoApoioAcao: 'Selecionar',
    coordenacaoApoioOperacional: 'Selecionar',
    equipeTecnica: [''], // Array of strings
    equipeJuridica: "Selecionar", // Array of strings
    observacao: '',
    osElaboradaPor: '',
    local: '',
    publicoAlvo: '',
    status: 'AGENDADO',
    tr: {}, // Assuming tr, mr, and rf are objects
    mr: {},
    rf: {},
  };

  isOsValid(os: any): boolean {
    // Helper function to check if a string is valid
    const isValidString = (str: string): boolean => {
      return str !== null &&
        typeof str === 'string' &&
        str.trim().length >= 3 &&
        str !== "Selecionar";
    };

    // Check if required string properties are valid
    const requiredStringProps = [
      'idTr',
      'unidadeSolicitante',
      'tituloEvento',
      'modalidade',
      'demanda',
      'coordenadorGeral',
      'coordenadorApoioInstitucional',
      'coordenadorAcaoCapacitacao',
      'coordenacaoApoioAcao',
      'coordenacaoApoioOperacional',
      'osElaboradaPor',
      'local',
      'publicoAlvo'
    ];

    for (const prop of requiredStringProps) {
      if (!isValidString(os[prop])) {
        return false;
      }
    }

    // Check if date and time properties are valid (basic format check)
    const dateProps = ['dataInicio', 'dataFim'];
    for (const prop of dateProps) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(os[prop])) {
        return false;
      }
    }

    const timeProps = ['horaInicio', 'horaFim'];
    for (const prop of timeProps) {
      if (!/^\d{2}:\d{2}$/.test(os[prop])) {
        return false;
      }
    }

    // Check if numeric properties are valid
    const numericProps = ['quantidadeParticipantes', 'cargaHoraria'];
    for (const prop of numericProps) {
      if (isNaN(Number(os[prop]))) {
        return false;
      }
    }

    // Check if array properties are valid (not empty and contain valid strings)
    const arrayProps = ['equipeTecnica', 'equipeJuridica'];
    for (const prop of arrayProps) {
      if (!Array.isArray(os[prop]) || os[prop].length === 0 || !os[prop].every(isValidString)) {
        return false;
      }
    }

    // All checks passed
    return true;
  }

  @ViewChild('dataToExport', { static: false })
  public dataToExport!: ElementRef;


  pdfUrl = environment.apiUrl;

  isDisabled = true;

  generateAndDownloadPdf(doc: any, tipo: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    doc.equipeJuridica = [doc.equipeJuridica]
    if (tipo == 'os') {
      this.http
        .post(this.pdfUrl + '/gerarPdf/' + 'os', doc, {
          headers,
          responseType: 'blob',
        })
        .subscribe(
          (response: Blob) => {
            console.log('teste')
            const blob = new Blob([response], { type: 'application/pdf' });
            const filename = 'relatorio.pdf'; // Customize the filename if needed
            saveAs(blob, filename);
          },
          (error) => {
            console.error('Error generating PDF:', error);
          }
        );
    } else {
      this.http
        .post(this.pdfUrl + '/gerarPdf2/' + 'os2', doc, {
          headers,
          responseType: 'blob',
        })
        .subscribe(
          (response: Blob) => {
            console.log('teste')
            const blob = new Blob([response], { type: 'application/pdf' });
            const filename = 'relatorio.pdf'; // Customize the filename if needed

            saveAs(blob, filename);
          },
          (error) => {
            console.error('Error generating PDF:', error);
          }
        );
    }

  }

  title = 'export-pdf';
  imprimir = false;
  salvarRelatorio2(fonte: string) {
    this.imprimir = true;

    this.exibirOs = true;
    this.exibirTr = true;

    this.generateAndDownloadPdf(fonte == 'os' ? this.os : this.termoRecisao, fonte);
    setTimeout(() => {
      this.imprimir = false;
      this.exibirOs = fonte === 'OS';
      this.exibirTr = fonte === 'TR';
      this.voltar();
    }, 1750);
  }
  salvarRelatorio(fonte: string) {
    this.imprimir = true;

    this.exibirOs = true;
    this.exibirTr = true;

    const data = document.getElementById('dataToExport');
    if (data) {
      html2canvas(data).then((canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calculate scaling factors to fit content within the page
        const horizontalScale = pageWidth / canvas.width;
        const verticalScale = pageHeight / canvas.height;

        // Use the smaller scaling factor to ensure the entire content fits without cropping
        const scaleFactor = Math.min(horizontalScale, verticalScale);

        const imgWidth = canvas.width * scaleFactor;
        const imgHeight = canvas.height * scaleFactor;

        const contentDataURL = canvas.toDataURL('image/png');

        // Add the image to the PDF, centered both horizontally and vertically
        pdf.addImage(
          contentDataURL,
          'PNG',
          (pageWidth - imgWidth) / 2,
          (pageHeight - imgHeight) / 2,
          imgWidth,
          imgHeight
        );

        pdf.save('relatorio.pdf');

        setTimeout(() => {
          this.imprimir = false;
          this.exibirOs = fonte === 'OS';
          this.exibirTr = fonte === 'TR';
        }, 1750);
      });
    }
  }
  //menu

  goOs() {
    this.router.navigateByUrl('app-editar-curso-modal');
  }


  currentUser: any = {
    isCoordenador: true,
    isEstagiario: false,
  }


  //tttt
  coordCapacitacao: string[] = ["Selecionar", "Clenilda Poletto",
    "Maarina Spinelli", "Clenilda Poletto & Marina Spinelli"
  ];

  equipeJuridica: string[] = ["Selecionar", "Erika Maria Curvo Pinho Campos",
    "Maira de Campos Borges", "Erika Maria Curvo Pinho Campos & Maira de Campos Borges"
  ];

  coordApoioAcao: string[] = [
    "Selecionar", "Agripino Bonilha Neto",
    "Alexandre Viegas a Silva",
    "Cristiane Maria Moreira da Silva de Oliveira",
    "Diana Catarina Souza",
    "Dilce Meire Nunes Medeiros",
    "Elen Wannessa de Pieri",
    "Erika Maria Curvo Pinho Campos",
    "Evanildes Maria dos Reis",
    "Fabiano Mrozkowski",
    "Giliane Rondon Gracioso",
    "Isadora Neiva Asevedo Bastos",
    "Jaques Marques de Moraes",
    "José de Arruda Campos Filho",
    "Josenei Souza da Silva",
    "Júlio Aramito Leal",
    "Karinny Emanuelle Campos Muzzi de Oliveira",
    "Kleber Batista Souza Andrade",
    "Maira de Campos Borges",
    "Marcial de Carvalho Júnior",
    "Marcondes Rufino Simplício Filho",
    "Marcos Rodrigues da Silva",
    "Maria Carolina Aldem Vianna Lino",
    "Oscar da Costa Ribeiro Neto",
    "Pâmela Taires Bonate de Almeida",
    "Romar José de Oliveira",
    "Sinaila Paranhos Quida",
    "Vanessa Aparecida Oliveira Abrao Moraes",
    "Taisa Tavares do Nascimento",
    "Thayssa Conceição Silva"
  ];
  coordApoioOperacional: string[] = [
    "Selecionar",
    "Agripino Bonilha Neto",
    "Alexandre Viegas a Silva",
    "Cristiane Maria Moreira da Silva de Oliveira",
    "Diana Catarina Souza",
    "Dilce Meire Nunes Medeiros",
    "Elen Wannessa de Pieri",
    "Erika Maria Curvo Pinho Campos",
    "Evanildes Maria dos Reis",
    "Fabiano Mrozkowski",
    "Giliane Rondon Gracioso",
    "Isadora Neiva Asevedo Bastos",
    "Jaques Marques de Moraes",
    "José de Arruda Campos Filho",
    "Josenei Souza da Silva",
    "Júlio Aramito Leal",
    "Karinny Emanuelle Campos Muzzi de Oliveira",
    "Kleber Batista Souza Andrade",
    "Maira de Campos Borges",
    "Marcial de Carvalho Júnior",
    "Marcondes Rufino Simplício Filho",
    "Marcos Rodrigues da Silva",
    "Maria Carolina Aldem Vianna Lino",
    "Oscar da Costa Ribeiro Neto",
    "Pâmela Taires Bonate de Almeida",
    "Romar José de Oliveira",
    "Sinaila Paranhos Quida",
    "Vanessa Aparecida Oliveira Abrao Moraes",
    "Taisa Tavares do Nascimento",
    "Thayssa Conceição Silva"
  ];

}
