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
import { NotificacoesComponent } from '../notificacoes/notificacoes.component';
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
    NavbarComponent,
    EditarCursoModalComponent,
    MenuDocsComponent,

  ],
  templateUrl: './editar-curso-modal.component.html',
  styleUrl: './editar-curso-modal.component.scss',
})
export class EditarCursoModalComponent {
  selectedStatus: any;
  selectedEditStatus: any;
  exibirCurso: any = false;
  curso: any;
  stId: any;
  closeAddModal() { }

  exibirMenuOS = true;
  exibirMenuTR = true;
  exibirMenuMR = true;
  exibirMenuRF = true;
  exibirMenuAnexos = true;

  faseAtual = 0;


  Osvisivel = true;
  Trvisivel = true;
  Mrvisivel = true;
  Acvisivel = true;
  Rfvisivel = true;
  Anexosvisivel = true;

  trocarStatus() {
    if (this.selectedStatus == 'Agendado') {
      this.os.status = 'Agendado';
      this.os.status = this.selectedEditStatus;
    } else {
      if (this.selectedStatus == 'Em andamento') {
        this.os.status = 'Em andamento';
        this.os.status = this.selectedEditStatus;
      } else {
        if (this.selectedStatus == 'Finalizado') {
          this.os.status = 'Finalizado';
          this.os.status = this.selectedEditStatus;
        }
      }
    }

  }

  async ngOnInit() {
    this.os.datasHorarios = [{ data: '', horaInicio: '', horaFim: '' }];

    this.adicionarDataHorario();
    this.route.params.subscribe((params) => {
      this.idCurso = params['idCurso'];
      this.isEditando = params['isEditando'] === 'true' ? true : false;
      this.os.id = this.idCurso + '';
    });
    if (this.isEditando != undefined && this.isEditando == true) {
      this.carregando = true;
      setTimeout(async () => {
        await this.carregarDadoCursoEditando();


      }, 650);
    }
    this.os.id = this.idCurso + '';
  }

  apiUrl = environment.jsonServerUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private websocketService: WebsocketService,
    private toast: ToastrService,
    private authService: AuthService

  ) {
    this.authService.isLoggedUser$.subscribe((isLoggedUser) => {
      this.isLoggedUser = isLoggedUser;
    });

    this.authService.getUser(this.isLoggedUser).then(u => {
      this.user = u;
      this.disabled = this.user.isEstagiario === false ? true : false;
      if (this.disabled == true) {
        this.disabled = this.user.isCoordenador === false ? true : false;;
      }
    });

  }

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
        .get((this.apiUrl + '/os/' + this.idCurso))
        .toPromise();
      this.os = res;
      this.equip1 = this.os.equipeTecnica.includes('Criar Link');
      this.equip2 = this.os.equipeTecnica.includes('Elaborar e Encaminhar Avaliação');
      this.equip3 = this.os.equipeTecnica.includes('Emitir Certificado');
      this.equip4 = this.os.equipeTecnica.includes('Emitir Relatório Final');
      this.Trvisivel = this.os.equipeJuridica;
      if (this.os.idTr != undefined && this.os.idTr != null && this.os.idTr.length > 0) {
        let trr: any = this.os.tr;
        this.trId = this.os.idTr;
        let res2: any = await this.http
          .get(this.apiUrl + '/tr/' + this.trId)
          .toPromise();
        this.termoRecisao = res2;
      } else {
        this.trId = null;
      }

      let equipeT = this.os.equipeTecnica;
      this.exibirMatriz = this.os.equipeEdu;
      this.termoRecisao = res.tr === undefined ? this.termoRecisao : res.tr;
      this.carregando = false;
      if (this.os.datasHorarios != undefined && this.os.datasHorarios != null && this.os.datasHorarios.length === 0) {
        this.os.datasHorarios = [];
        this.adicionarDataHorario();
      }
    }


  }
  isLoggedUser: any;
  user: any = {};

  carregando = false;
  recarregaPagina() {
    setTimeout(() => {
    }, 700);
  }

  // Método para fechar o modal
  fechar() {
    this.router.navigateByUrl('lista-cursos');
  }

  addField() {
    this.os.equipeJuridica = this.os.equipeJuridica;
  }
  exibirMatriz = false
  salvarCheckMatriz() {

    this.exibirMatriz = !this.exibirMatriz;
    this.os.equipeEdu = this.exibirMatriz;
  }

  checkObjectProperties(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value === null || value === undefined || value === "") {
          return false;
        }
        // If the property is an array, check if it's empty
        if (Array.isArray(value) && value.length === 0) {
          return false;
        }
        // If the property is another object, recursively check its properties
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          if (!this.checkObjectProperties(value)) {
            return false;
          }
        }
      }
    }
    return true;
  }


  equip1 = false;
  equip2 = false;
  equip3 = false;
  equip4 = false;
  equipeJuridica = false;

  termoRecisao = {
    enviaEmail:false,
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
  exibirMr = false;
  exibirRf = false;
  exibirAnexos = false;


  proximaPagina() {
    this.exibirTr = !this.exibirTr;
    this.exibirOs = !this.exibirOs;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  proximaPaginaOs() {
    this.exibirOs = this.exibirOs;
    this.exibirTr = !this.exibirTr;
    this.exibirMr = !this.exibirMr;
    this.exibirRf = !this.exibirRf;
    this.exibirAnexos = !this.exibirAnexos;
    this.faseAtual = this.faseAtual == 0 ? 1 : 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  proximaPaginaMr() {
    this.exibirOs = !this.exibirOs;
    this.exibirTr = !this.exibirTr;
    this.exibirMr = this.exibirMr;
    this.exibirAnexos = !this.exibirAnexos;
    this.faseAtual = this.faseAtual == 0 ? 1 : 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  proximaPaginaRf() {
    this.exibirOs = !this.exibirOs;
    this.exibirTr = !this.exibirTr;
    this.exibirMr = !this.exibirMr;
    this.exibirAnexos = !this.exibirAnexos;
    this.exibirRf = this.exibirRf;
    this.faseAtual = this.faseAtual == 0 ? 1 : 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  proximaPaginaTr() {
    this.exibirOs = !this.exibirOs;
    this.exibirTr = this.exibirTr;
    this.exibirMr = !this.exibirMr;
    this.exibirAnexos = !this.exibirAnexos;
    this.exibirRf = !this.exibirRf;
    this.faseAtual = this.faseAtual == 0 ? 1 : 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  disabled = false;

  proximaPaginaAnexos() {
    this.exibirOs = !this.exibirOs;
    this.exibirTr = !this.exibirTr;
    this.exibirMr = !this.exibirMr;
    this.exibirRf = !this.exibirRf;
    this.exibirAnexos = this.exibirAnexos;
    this.faseAtual = this.faseAtual == 0 ? 1 : 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }



  // changePositionCondition:boolean = false;

  //async changePositionDocPrint (
  //  if(this.imprimir) {

  //  }
  //)

  tess() {
    console.log(this.equip1);
  }
  camposIn = false;

  public async salvaCurso() {
    let os: any = this.os;
    // if (!this.checkObjectProperties(os)) {
    //   console.log("SOCORROROROR")
    //   this.camposIn = true;
    //   setTimeout(() => {
    //     this.camposIn = false;

    //   }, 3000);
    //   return;
    // } else {
    //   this.camposIn = false;
    // }

    this.carregando = true;
    os.equipeTecnica = [];
    if (this.equip1) {
      os.equipeTecnica.push('Criar Link');
    }
    if (this.equip2) {
      os.equipeTecnica.push('Elaborar e Encaminhar Avaliação');
    }
    if (this.equip3) {
      os.equipeTecnica.push('Emitir Certificado');
    }
    if (this.equip4) {
      os.equipeTecnica.push('Emitir Relatório Final');
    }
    this.Trvisivel = this.os.equipeJuridica;
    os.modalidade = os.modalidade.length > 0 ? os.modalidade : 'NENHUM';
    os.demanda = os.demanda.length > 0 ? os.demanda : 'OUTRA DEMANDA';
    if (this.trId != null) {
      os.idTr = this.trId;
    }

    const datas: string[] = [];
    const horas: string[] = [];
    const horasfim: string[] = [];

    os.datasHorarios.forEach((item: { data: string; horaInicio: string; horaFim: string; }) => {
      datas.push(item.data);
      horas.push(item.horaInicio);
      horasfim.push(item.horaFim);
    });

    os.datasHorarios;
    os.datas = datas;
    os.horas = horas;
    os.horasfim = horasfim;



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

  os: any = {

    datasHorarios: [{ data: '', horaInicio: '', horaFim: '' }],
    idTr: '',
    id: '',
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
    coordenadorGeral: 'Marcos José da Silva', // Dropdown with predefined options
    coordenadorApoioInstitucional: 'Carlos Arantes', // Dropdown with predefined options
    coordenadorAcaoCapacitacao: '',
    coordenacaoApoioAcao: [''],
    coordenacaoApoioOperacional: [''],
    equipeTecnica: [''], // Array of strings
    equipeJuridica: false, // Array of strings
    observacao: '',
    osElaboradaPor: '',
    local: '',
    publicoAlvo: '',
    status: 'Agendado',
    publicoPrevisto: '',
    objetivo: '',
    publicoAlvomr: '',
    linkinscricao: '',
    tr: {}, // Assuming tr, mr, and rf are objects
    mr: {},
    rf: {},
    "nome_presidente3": "Raoni Pedroso Ricci",
    "atribuicoes3": "•Organizar/planejar com a unidade demandante as providencias necessárias para criação das artes: Tamplates, post´s, certificados para painelistas, programação, fichas de perguntas; etc;\n•Providenciar a diagramação da Programação;\n•Providenciar banner´s de sinalização/identificação dos ambientes de realização da Ação Educacional;\n•Providenciar juntamente com a empresa terceirizada a gravação e sonorização;\n•Confeccionar material eletrônico para divulgação (e-mail marketing, post whats, tamplates, Wallpaper etc.);\n•Confeccionar banner eletrônico e disponibilizar no site do TCE-MT;\n•Providenciar Púlpito digital para o Auditório da ESC;\n•Providenciar backdrop;\n•Providenciar 10 microfones;\n•Providenciar material gráfico: Pastas, certificado dos palestrantes, blocos de rascunho; fichas de perguntas;\n•Realizar a cobertura jornalística e fotográfica da ação educacional;\n•Criar link do YouTube para transmissão;\n•Providenciar transmissão via canais de comunicação do TCE-MT;\n•Inserir transmissão para libras.",
    "nome_presidente2": "José Mota",
    "atribuicoes2": "•Produzir conteúdo de TV (entrevistas);\n•Realizar a cobertura jornalística e fotográfica da ação educacional;\n•Providenciar transmissão da Ação Educacional;\n•Confeccionar filmes/vídeos para divulgação institucional.",
    "nome_presidente1": "Hadassah Suzannah Beserra de Souza",
    "atribuicoes1": "Disponibilizar equipe para garantir a segurança dos locais da Ação Educacional; Disponibilizar Bombeiros Militares / Brigadistas em atendimento a CI 252/2024/NQVT; Reservar o espaço de estacionamento na frente da ESC para painelistas e palestrantes; Reservar a frente da ESC para embarque e desembarque das Autoridades.",
    "nome_presidente8": "Carlos Roberto Lourençon",
    "nome_presidente7": "Núcleo de Cerimonial Danielle Sarris",
    "nome_presidente6": "Núcleo de Patrimônio Rodrigo Welter Teischmann",
    "nome_presidente5": "Gerencia de Transportes Alexandre Biancardi",
    "atribuioces9": "•Providenciar serviço de coffee break;\n•Informar ao restaurante o público previsto da Ação Educacional;\n•Disponibilizar Intérprete de libras;\n•Apoiar na garantia de recursos necessários",
    "atribuicoes7": "•Organizar e apoiar toda logística da ação educacional e alinhamento das diretrizes com as unidades envolvidas;\n•Definir em conjunto com o Gabinete do Conselheiro Guilherme Maluf o dispositivo de honra;\n•Elaborar roteiro e submeter ao Gabinete do Conselheiro Guilherme Maluf para aprovação;\n•Receber cópia das CI’s para a confirmação de presença dos Conselheiros e demais convidados que compõem mesa de honra;\n•Confirmar via telefone a participação das autoridades e demais convidados;\n•Recepcionar e prestar informações aos participantes;\n•Disponibilizar recepcionistas para recolhimento das perguntas;\n•Disponibilizar Mestre Cerimônia.",
    "atribuicoes6": "•Disponibilizar reforço para equipe de limpeza;\n•Disponibilizar garçom para atender exclusivamente as autoridades;\n•Garantir café e água em todos os ambientes da Ação Educacional;\n•Disponibilizar equipe para movimentação dos patrimônios.",
    "atribuicoes5": "•Disponibilizar veículos e motoristas para o transporte dos painelistas e palestrantes;",
    "nome_presidente4": "André Luiz Costa Cruz",
    "atribuicoes4": "•Disponibilizar técnicos para atendimento/suporte durante todo evento;\n•Garantir velocidade/conexão adequada para transmissão e credenciamento da Ação Educacional.",
    "nome_presidente11": "José Carlos Novelli",
    "atribuicoes18": "Para conhecimento e participação.",
    "nome_presidente19": "Conselheiro Domingos Neto",
    "atribuicoes17": "Para conhecimento e participação.",
    "nome_presidente18": "Alisson Carvalho de Alencar",
    "atribuicoes16": "Para conhecimento e participação.",
    "nome_presidente17": "Grhegory Paiva Maia",
    "atribuicoes15": "Para conhecimento.",
    "nome_presidente16": "Guilherme Maluf",
    "atribuicoes14": "•Encaminhar Termo de Referência da Ação Educacional a ESC;\n•Definir o público do evento em conjunto com a Presidência;\n•Enviar ofícios para Prefeitos e Secretários de Saúde e demais Autoridades;\n•Definir programação;\n•Encaminhar programação para Comunicação para diagramação;\n•Verificar a possibilidade de uso do Plenário do TCE-MT para transmissão do encontro;\n•Encaminhar programação para ESC e demais unidades envolvidas;\n•Supervisionar o planejamento e a execução da Ação Educacional;\n•Encaminhar CI/Convite para Membros, Procuradores e todas as unidades em conjunto com o Gabinete da Presidência;\n•Definir em conjunto com o cerimonial, o dispositivo de honra;\n•Aprovar o roteiro em conjunto com cerimonial;\n•Encaminhar cópias dos ofícios para a ESC e Cerimonial;\n•Encaminhar para o Núcleo de Cerimonial cópias dos CI´s, para confirmação de presença;\n•Encaminhar mini currículo dos painelistas a SECOM e Cerimonial;\n•Orçar despesas da Ação Educacional;\n•Solicitar compra de passagem e hospedagem para palestrante;\n•Encaminhar a lista de painelistas e palestrantes que necessitarão de transporte;\n•Encaminhar a lista de painelistas e palestrantes que irão estacionar na frente da ESC;\n•Solicitar os slides das apresentações aos painelistas e encaminhar para ESC até o dia 31/10/2024.",
    "nome_presidente15": "Mauricio Marques",
    "atribuicoes13": "•Realizar as ações financeiras e orçamentárias relativas às despesas do TCE-MT.",
    "nome_presidente14": "Marcos José da Silva",
    "nome_presidente13": "Marina Pinelli",
    "nome_presidente12": "Carlos Rubens",
    "nome_presidente20": "Clenilda Poletto",
    "atribuicoes12": "•Receber a demanda da Ação Educacional;\n•Compartilhar com o Conselheiro supervisor a demanda recebida;\n•Criar link de inscrição;\n•Definir equipe de trabalho;\n•Elaborar e acompanhar a matriz de responsabilidades, o checklist e demais documentos necessários;\n•Gerenciar a ação educacional quanto aos aspectos operacionais, logísticos e de divulgação;\n•Encaminhar diariamente a lista de inscritos para a Comissão permanente de Saúde e Assistência Social do TCE-MT;\n•Solicitar serviço de coffee break;\n•Organizar a montagem dos materiais da Ação Educacional: pastas, canetas e blocos de rascunho;\n•Organizar sala de Pessoas Importantes;\n•Solicitar Intérprete de libras;\n•Providenciar som ambiente no foyer, durante coffee break;\n•Solicitar canetas;\n•Providenciar transporte dos palestrantes e painelistas;\n•Encaminhar para o Gabinete Militar, a lista das painelistas e palestrantes para reserva espaço de estacionamento na frente da Escola;\n•Liberar Certificado aos participantes",
    "nome_presidente10": "André Luiz Costa Cruz",
    "atribuicoes11": "•Disponibilizar técnicos para atendimento/suporte durante todo evento;\n•Garantir velocidade/conexão adequada para transmissão e credenciamento da Ação Educacional.",
    "nome_presidente9": "Raoni Pedroso Ricci",
    "atribuicoes10": "•Organizar/planejar com a unidade demandante as providencias necessárias para criação das artes: Tamplates, post´s, certificados para painelistas, programação, fichas de perguntas; etc;\n•Providenciar a diagramação da Programação;\n•Providenciar banner´s de sinalização/identificação dos ambientes de realização da Ação Educacional;\n•Providenciar juntamente com a empresa terceirizada a gravação e sonorização;\n•Confeccionar material eletrônico para divulgação (e-mail marketing, post whats, tamplates, Wallpaper etc.);\n•Confeccionar banner eletrônico e disponibilizar no site do TCE-MT;\n•Providenciar Púlpito digital para o Auditório da ESC;\n•Providenciar backdrop;\n•Providenciar 10 microfones;\n•Providenciar material gráfico: Pastas, certificado dos palestrantes, blocos de rascunho; fichas de perguntas;\n•Realizar a cobertura jornalística e fotográfica da ação educacional;\n•Criar link do YouTube para transmissão;\n•Providenciar transmissão via canais de comunicação do TCE-MT;\n•Inserir transmissão para libras.",
    "nome_presidente26": "Sérgio Ricardo de Almeida",
    "atribuicoes23": "•Validar a Ação Educacional;\n•Assinar ofícios para Prefeitos e Secretários de Saúde e demais Autoridades, em conjunto com Gabinete do Conselheiro Guilherme Maluf;\n•Assinar CI/Convite para participação de Conselheiros e Procuradores, em conjunto com Gabinete do Conselheiro Guilherme Maluf;\n•Autorizar as despesas inerentes da Ação Educacional.",
    "nome_presidente25": "Paula Pietro",
    "atribuicoes22": "•Acompanhar a execução da Ação Educacional junto à Comissão Permanente de Saúde e Assistência Social do TCE-MT;\n•Confirmar a participação do Presidente na abertura da Cerimônia.",
    "nome_presidente24": "Nilson Fernando Gomes Bezerra",
    "atribuicoes21": "Para conhecimento e participação.",
    "nome_presidente23": "Antônio Joaquim",
    "atribuicoes20": "Para conhecimento e participação.",
    "nome_presidente22": "Conselheiro Valter Albano",
    "nome_presidente21": "Waldir Júlio Teis",
    "atribuicoes19": "Para conhecimento e participação.",
  };

  atrib: any = {
    descricao: 'Nome do Responsável/Unidade',
    presidente: 'Sérgio Ricardo de Almeida: Validar a Ação Educacional; Assinar ofícios para Prefeitos e Secretários de Saúde e demais Autoridades...',
    gabinetePresidencia: 'Paula Pietro: Acompanhar a execução da Ação Educacional...',
    secretariaGeral: 'Nilson Fernando Gomes Bezerra: Para conhecimento e participação',
    gabineteConselheiro: 'Antônio Joaquim: Para conhecimento e participação',
    abineteConselheiroValter: 'Valter Albano: Para conhecimento e participação',
    conselheiroSupervisor: 'Waldir Júlio Teis: Para conhecimento e participação',
    gabineteConselheiroNovelli: 'José Carlos Novelli: Para conhecimento e participação',
    gabineteConselheiroDomingos: 'Domingos Neto: Para conhecimento e participação',
    procuradorGeral: 'Alisson Carvalho de Alencar: Para conhecimento e participação',
    consultoriaJuridicaGeral: 'Grhegory Paiva Maia: Para conhecimento',
    gabineteGuilherme: 'Gabinete do Guilherme: Encaminhar Termo de Referência da Ação',
    observacao: ''
  }

  // Define a propriedade com as opções para o <select>
  selectsCoordenacaoApoio: string[] = ['Alexandre Viegas da Silva',
    'Dilce Meire Nunes Medeiros Santos',
    'Fabiano Mrozkowski',
    'Karinny Emanuelle Campos Muzzi de Oliveira',
    'Oscar da Costa Ribeiro Neto',
    'Kleber Batista Souza Andrade'];


  // Define a propriedade com as opções para o <select>
  opcoesOperacional: string[] = ['Evanildes Maria dos Reis',
    'Jaques Marques de Moraes',
    'Fabiano Mrozkowski',
    'José de Arruda Campos Filho',
    'Josenei Souza da Silva',
    'Júlio Aramito Leal',
    'Marcos Rodrigues da Silva',
    'Sinaila Paranhos Quida'];


  // Função para adicionar uma nova entrada na seção "Apoio Coordenadoria"
  adicionarCoordenacaoApoio() {
    this.os.coordenacaoApoioAcao.push('');
  }

  // Função para remover uma entrada específica na seção "Apoio Coordenadoria"
  removerCoordenacaoApoio(index: number) {
    if (this.os.coordenacaoApoioAcao.length > 1) {
      this.os.coordenacaoApoioAcao.splice(index, 1);
    }
  }

  // Função para adicionar uma nova entrada na seção "Coordenação de Apoio Operacional"
  adicionarCoordenacaoOperacional() {
    this.os.coordenacaoApoioOperacional.push('');
  }

  // Função para remover uma entrada específica na seção "Coordenação de Apoio Operacional"
  removerCoordenacaoOperacional(index: number) {
    if (this.os.coordenacaoApoioOperacional.length > 1) {
      this.os.coordenacaoApoioOperacional.splice(index, 1);
    }
  }


  matriz: any = {}


  @ViewChild('dataToExport', { static: false })
  public dataToExport!: ElementRef;


  pdfUrl = environment.apiUrl;

  generateAndDownloadPdf(doc: any, tipo: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (tipo == 'os') {
      doc.datas = [];
      doc.horas = [];
      doc.horasfim = [];
      doc.datasHorarios.forEach((element: { data: any; horaInicio: any; horaFim: any; }) => {
        doc.datas.push(element.data.toString());
        doc.horas.push(element.horaInicio.toString());
        doc.horasfim.push(element.horaFim.toString());
      });
      console.log("KAKAKAKAKPQP");
      console.log(doc);
      this.http
        .post(('/api' + '/gerarPdf/' + 'os'), doc, {
          headers,
          responseType: 'blob',
        })
        .subscribe(
          (response: Blob) => {
            console.log('teste')
            const blob = new Blob([response], { type: 'application/pdf' });
            const filename = 'relatorio_os.pdf'; // Customize the filename if needed
            saveAs(blob, filename);
          },
          (error) => {
            console.error('Error generating PDF:', error);
          }
        );
    } else if (tipo == 'tr') {
      this.http
        .post('/api' + '/gerarPdf2/' + 'os2' + (this.enviaEmail ? '/email' : ''), doc, {
          headers,
          responseType: 'blob',
        })
        .subscribe(
          (response: Blob) => {
            console.log('teste')
            const blob = new Blob([response], { type: 'application/pdf' });
            const filename = 'relatorio_tr.pdf'; // Customize the filename if needed

            saveAs(blob, filename);
            this.enviaEmail = false;
          },
          (error) => {
            console.error('Error generating PDF:', error);
          }
        );
    } else if (tipo == 'mr') {
      this.http
        .post('/api' + '/gerarPdf3/' + 'os3', doc, {
          headers,
          responseType: 'blob',
        })
        .subscribe(
          (response: Blob) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const filename = 'relatorio_mr.pdf'; // Customize the filename if needed

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
  salvarRelatorio3(fonte: string) {
    this.imprimir = true;

    this.exibirOs = true;

    this.generateAndDownloadPdf(fonte == 'os' ? this.os : this.termoRecisao, fonte);
    setTimeout(() => {
      this.imprimir = false;
      this.exibirOs = fonte === 'OS';
      this.exibirTr = fonte === 'TR';
      this.voltar();
    }, 1750);
  }
  salvarRelatorio2(fonte: string) {
    this.imprimir = true;

    this.exibirOs = true;
    this.generateAndDownloadPdf(fonte == 'os' ? this.os : (fonte === 'tr' ? this.termoRecisao : this.os), fonte);
    setTimeout(() => {
        this.imprimir = false;
        this.exibirOs = fonte === 'OS';
        this.exibirTr = fonte === 'TR';
        this.exibirMr = fonte === 'MR'; // Add this line
        this.voltar();
    }, 1750);
  }

  enviaEmail = false;
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

  adicionarDataHorario() {
    this.os.datasHorarios.push({ data: '', horaInicio: '', horaFim: '' });
  }

  adicionarPrimeiraData() {
    this.os.datasHorarios.push({ data: '', horaInicio: '', horaFim: '' });
  }

  removerDataHorario(index: number) {
    if (this.os.datasHorarios.length > 1) {
      this.os.datasHorarios.splice(index, 1);
    }
  }












  @ViewChild('menu', { static: false }) menu!: ElementRef;

  async printPageAsPDF() {
    this.menu.nativeElement.style.display = 'none';
    if (!this.dataToExport) {
      console.error('Element not found');
      return;
    }

    const element = this.dataToExport.nativeElement;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('page.pdf');
    this.menu.nativeElement.style.display = 'block';
  }






  teste = true;




}
