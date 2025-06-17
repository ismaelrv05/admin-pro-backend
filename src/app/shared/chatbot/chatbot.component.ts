import { AfterViewChecked, Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatWindow') chatWindow!: ElementRef;
  @Input() contextoInmueble: { nombre: string, precio: number } | null = null;

  public pregunta = '';
  public loading = false;
  public visible = false;
  public mensajes: { texto: string, esUsuario: boolean }[] = [];
  public autoScroll = true;

  constructor(private _chatbotService: ChatbotService) { }

  ngOnInit(): void {
    this.cargarHistorial();
  }

  // ngAfterViewInit(): void {
  //   this.chatWindow?.nativeElement.addEventListener('scroll', () => {
  //     const el = this.chatWindow.nativeElement;
  //     const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  //     this.autoScroll = distanceToBottom < 50;
  //   });
  // }

  enviar() {
    if (!this.pregunta.trim()) return;

    const mensajeUsuario = this.pregunta;
    const datosInmueble = this.contextoInmueble;
    this.mensajes.push({ texto: mensajeUsuario, esUsuario: true }); // mensaje del usuario

    this.guardarHistorial();
    this.loading = true;

    console.log('Enviando con contextoInmueble:', this.contextoInmueble);

    this._chatbotService.enviarPregunta(mensajeUsuario, datosInmueble, this.mensajes).subscribe({
      next: (res) => {
        this.mensajes.push({ texto: res.respuesta, esUsuario: false }); // respuesta del chatbot
        this.loading = false;
        this.guardarHistorial();
        this.scrollAlFinal();

        const renderStart = performance.now();
        setTimeout(() => {
          const renderEnd = performance.now();
          console.log(`🎨 Tiempo de renderizado en frontend: ${Math.round(renderEnd - renderStart)} ms`);
        }, 0);

      },
      error: () => {
        this.mensajes.push({ texto: 'Error al obtener respuesta.', esUsuario: false });
        this.loading = false;
        this.guardarHistorial();
        this.scrollAlFinal();
      }
    });

    this.pregunta = '';
    this.scrollAlFinal();
  }

  scrollAlFinal(): void {
    setTimeout(() => {
      if (this.chatWindow) {
        this.chatWindow.nativeElement.scrollTo({
          top: this.chatWindow.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 0);
  }


  limpiarConversacion() {
    this.mensajes = [];
    localStorage.removeItem('chatHistorial');
  }

  toggle() {
    this.visible = !this.visible;
  }

  guardarHistorial() {
    localStorage.setItem('chatHistorial', JSON.stringify(this.mensajes));
  }

  cargarHistorial() {
    const historial = localStorage.getItem('chatHistorial');
    if (historial) {
      this.mensajes = JSON.parse(historial);
    }
  }

  formatearMensaje(texto: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const conSaltos = texto
      .replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">Ver inmueble</a>`)
      .replace(/\n/g, '<br>');

    return conSaltos;
  }
}
