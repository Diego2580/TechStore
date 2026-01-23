# 📚 DEFENSA ORAL - TechStore Angular + SpringBoot

## 🎯 Introducción (30 segundos)

"Mi proyecto es una página web de una tienda tecnológica desarrollada con **Angular 21.1.0**, un framework frontend moderno, con un backend robusto en **SpringBoot 3.3.0 con PostgreSQL**. El proyecto tiene dos interfaces: una **vista pública** visible para cualquier usuario, y un **panel administrativo** protegido con autenticación, donde se puede actualizar el contenido dinámicamente desde una API REST."

---

## 1️⃣ ¿POR QUÉ ELEGÍ ANGULAR?

### Ventajas de Angular sobre otras opciones:

| Factor | Angular | React | Vue |
|--------|---------|-------|-----|
| **TypeScript** | ✅ Nativo e integrado | ✅ Soportado | ⚠️ Opcional |
| **CLI Robusta** | ✅ Excelente | ⚠️ Secundario | ✅ Buena |
| **Estructura** | ✅ Opinionada (ideal para proyectos grandes) | ⚠️ Flexible | ✅ Intermedia |
| **Routing SPA** | ✅ Nativo y potente | ⚠️ Requiere librerías | ✅ Integrado |
| **Guards & Middleware** | ✅ Auth Guard integrado | ⚠️ Requiere librerías | ⚠️ Requiere librerías |
| **SSR (Server-Side Render)** | ✅ Soporte nativo | ✅ Posible con Next.js | ✅ Posible con Nuxt |

**Decisión personal**: Angular es ideal para este proyecto porque necesitaba:
- Estructura clara y escalable
- Autenticación con Guards (proteger rutas)
- Componentes independientes (standalone)
- TypeScript type-safe

---

## 2️⃣ ESTRUCTURA DEL PROYECTO

```
tech-store-angular/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── header/          # Encabezado (en todas las páginas)
│   │   │   ├── footer/          # Pie de página
│   │   │   └── navbar/          # Navegación SPA
│   │   │
│   │   ├── guards/              # Protección de rutas
│   │   │   └── auth.guard.ts    # Verifica si está autenticado
│   │   │
│   │   ├── services/            # Lógica de negocio
│   │   │   ├── auth.service.ts  # Gestión de login
│   │   │   ├── company.service.ts # API Nosotros (empresa)
│   │   │   └── product.ts       # API Productos
│   │   │
│   │   ├── views/               # Páginas/componentes grandes
│   │   │   ├── home/            # Página principal
│   │   │   ├── acerca/          # Sección "Nosotros" 
│   │   │   ├── servicios/       # Servicios ofrecidos
│   │   │   ├── contacto/        # Contacto
│   │   │   └── admin-panel/     # Panel administrativo
│   │   │
│   │   ├── app.routes.ts        # Definición de rutas
│   │   ├── app.ts              # Componente raíz
│   │   └── app.html            # Template raíz
│   │
│   ├── index.html              # HTML principal
│   ├── main.ts                 # Punto de entrada
│   └── styles.css              # Estilos globales
│
├── angular.json                # Configuración Angular
├── package.json                # Dependencias (Angular, Bootstrap)
└── tsconfig.json               # Configuración TypeScript
```

---

## 3️⃣ ARCHIVOS CLAVE EXPLICADOS

### 📌 **app.routes.ts** - Definición de Rutas SPA

```typescript
export const routes: Routes = [
  { path: '', component: Home },                          // → localhost:4200/
  { path: 'acerca', component: Acerca },                  // → localhost:4200/acerca
  { path: 'servicios', component: Servicios },            // → localhost:4200/servicios
  { path: 'contacto', component: Contacto },              // → localhost:4200/contacto
  { path: 'login', component: Login },                    // → localhost:4200/login
  { 
    path: 'admin', 
    component: AdminPanel,
    canActivate: [AuthGuard]                              // ✅ Protegida: solo si está autenticado
  },
  { path: '**', redirectTo: '' }                          // Ruta por defecto
];
```

**¿Cómo funciona?**
- Cada ruta = una vista diferente SIN recargar la página
- `/admin` tiene `canActivate: [AuthGuard]` → si no estás logueado, te redirige a `/login`

---

### 🔐 **auth.guard.ts** - Protección de Rutas

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authService.estaAutenticado()) {
      return true;  // ✅ Permite acceder a /admin
    } else {
      this.router.navigate(['/login']);  // ❌ Redirige a login
      return false;
    }
  }
}
```

**¿Cómo funciona?**
- Antes de entrar a `/admin`, Angular pregunta: "¿canActivate?" 
- Si retorna `true` → entra a la ruta
- Si retorna `false` → redirige a `/login`

---

### 🔑 **auth.service.ts** - Gestión de Autenticación

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private estaAutenticado = signal(false);  // Señal para reactividad

  login(usuario: string, password: string): boolean {
    // ✅ Credenciales exactas: diego / diego123
    if (usuario === 'diego' && password === 'diego123') {
      this.estaAutenticado.set(true);
      localStorage.setItem('auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.estaAutenticado.set(false);
    localStorage.removeItem('auth');
  }

  estaAutenticado(): boolean {
    return this.estaAutenticado();
  }
}
```

**¿Cómo funciona?**
- Credenciales hardcodeadas: `diego` / `diego123`
- Usa `signal()` de Angular para reactividad (sin OnPush necesario)
- Persiste en `localStorage` para que se mantenga al recargar

---

### 📡 **company.service.ts** - Consumo de API (Nosotros)

```typescript
@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly API_URL = 'https://6942ca8269b12460f312d514.mockapi.io/nosotros';

  // Obtener información de la empresa
  getAll(): Observable<Nosotros> {
    return this.http.get<Nosotros[]>(this.API_URL).pipe(
      map((data) => (Array.isArray(data) && data.length > 0 ? data[0] : ({} as Nosotros)))
    );
  }

  // Actualizar información
  update(nosotros: Nosotros): Observable<Nosotros> {
    const id = nosotros.id || '1';
    return this.http.put<Nosotros>(`${this.API_URL}/${id}`, nosotros).pipe(
      tap(() => this.transferState.remove(this.KEY))
    );
  }

  // Crear nueva información (si no existe)
  create(nosotros: Nosotros): Observable<Nosotros> {
    return this.http.post<Nosotros>(this.API_URL, nosotros).pipe(
      tap(() => this.transferState.remove(this.KEY))
    );
  }
}
```

**¿Cómo funciona?**
- `getAll()` → GET a MockAPI, extrae primer elemento (porque retorna array)
- `update()` → PUT para actualizar datos existentes
- `create()` → POST para crear nuevos datos
- `tap()` y `map()` → operadores RxJS para transformar datos

**Estructura de datos (Nosotros):**
```typescript
{
  id: "1",
  imagen: "https://ejemplo.com/imagen.jpg",
  titulos_descripciones: [
    { titulo: "Misión", descripcion: "Proveer..." },
    { titulo: "Visión", descripcion: "Ser..." }
  ]
}
```

---

### 📦 **product.ts** - Consumo de API (Productos)

```typescript
@Injectable({ providedIn: 'root' })
export class Product {
  private readonly API_URL = 'https://6942ca8269b12460f312d514.mockapi.io/productos';

  // Obtener todos los productos
  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }

  // Crear producto
  create(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.API_URL, producto);
  }

  // Actualizar producto
  update(id: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/${id}`, producto);
  }

  // Eliminar producto
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Obtener sin caché (para admin)
  getFresh(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }
}
```

**Estructura de datos (Producto):**
```typescript
{
  id: "1",
  nombre: "Laptop Gaming",
  precio: 1200,
  descripcion: "RTX 3080, 16GB RAM...",
  imagen: "https://ejemplo.com/laptop.jpg"
}
```

---

## 4️⃣ VISTAS PÚBLICAS (Front Office)

### 🏠 **Home** (`home.ts` / `home.html`)

**Contenido:**
- Héroe con título y descripción
- Carrusel de productos destacados
- Botones de navegación

**Código clave:**
```typescript
cargarProductos(): void {
  this.productService.getAll().subscribe({
    next: (data) => {
      this.productos = data;  // Obtiene lista de productos de la API
      this.cargando = false;
    }
  });
}
```

**Bootstrap usado:**
- `container`, `row`, `col-md-6` → Layout responsivo
- `card`, `card-body` → Tarjetas de productos
- `btn btn-primary` → Botones

---

### 📖 **Acerca** (`acerca.ts` / `acerca.html`)

**Contenido:**
- Imagen de la empresa (lado izquierdo)
- Títulos y descripciones múltiples (lado derecho)

**Datos dinámicos desde API:**
```typescript
cargarNosotros(): void {
  this.companyService.getAll().subscribe({
    next: (data) => {
      this.nosotros = data;  // Obtiene desde MockAPI
    }
  });
}
```

**HTML renderizado:**
```html
<div class="col-md-6">
  <img [src]="nosotros.imagen" alt="Nosotros" class="img-fluid rounded" />
</div>
<div class="col-md-6">
  @for (item of nosotros.titulos_descripciones; track $index) {
    <h2>{{ item.titulo }}</h2>
    <p>{{ item.descripcion }}</p>
  }
</div>
```

---

### 🎯 **Servicios** (`servicios.ts` / `servicios.html`)

**Contenido:**
- Lista de servicios ofrecidos
- Íconos y descripciones

---

### 📬 **Contacto** (`contacto.ts` / `contacto.html`)

**Contenido:**
- Formulario de contacto (sin envío a API, solo frontend)
- Información de ubicación

---

## 5️⃣ VISTA ADMINISTRATIVA (Back Office)

### 🔐 **Login** (`login.ts` / `login.html`)

**Credenciales:**
- Usuario: `diego`
- Contraseña: `diego123`

**Código:**
```typescript
login(): void {
  if (this.authService.login(this.usuario, this.password)) {
    this.router.navigate(['/admin']);  // ✅ Acceso concedido
  } else {
    alert('Credenciales incorrectas');  // ❌ Acceso denegado
  }
}
```

---

### 🛠️ **Admin Panel** (`admin-panel.ts` / `admin-panel.html`)

**Funcionalidades:**

#### 📝 Sección 1: Gestionar "Nosotros"

**Interfaz:**
- Campo: URL de imagen (una sola para toda la sección)
- Campos temporales: Título y Descripción
- Botón: "➕ Agregar Título/Descripción"
- Lista: Títulos agregados con botones Editar/Eliminar

**Lógica:**
```typescript
agregarTituloDescripcion(): void {
  if (!this.formularioNosotros.titulo_temp || !this.formularioNosotros.descripcion_temp) {
    alert('Por favor completa título y descripción');
    return;
  }

  const nuevoTituloDesc: TituloDescripcion = {
    titulo: this.formularioNosotros.titulo_temp,
    descripcion: this.formularioNosotros.descripcion_temp
  };

  // Si estamos editando, reemplazar; si no, agregar
  if (this.editandoItemIndex !== null) {
    this.nosotros.titulos_descripciones[this.editandoItemIndex] = nuevoTituloDesc;
    this.editandoItemIndex = null;
  } else {
    this.nosotros.titulos_descripciones.push(nuevoTituloDesc);
  }

  this.formularioNosotros.titulo_temp = '';
  this.formularioNosotros.descripcion_temp = '';
}

guardarNosotros(): void {
  // Valida imagen y al menos un título/descripción
  if (!this.formularioNosotros.imagen || this.nosotros.titulos_descripciones.length === 0) {
    alert('Completa imagen y agrega títulos');
    return;
  }

  // Upsert: crea si no existe, actualiza si existe
  const accion$ = this.nosotros.id 
    ? this.companyService.update(this.nosotros) 
    : this.companyService.create(this.nosotros);

  accion$.subscribe({
    next: () => {
      alert('¡Información actualizada!');
      this.cargarNosotros();  // Recarga desde API
    }
  });
}
```

---

#### 🛍️ Sección 2: Gestionar Productos

**Interfaz:** Dos columnas
- **Columna izquierda**: Formulario de producto
  - Nombre (requerido)
  - Precio (requerido)
  - Descripción (requerido)
  - URL de imagen

- **Columna derecha**: Lista de productos en tabla
  - Imagen miniatura
  - Nombre y precio
  - Botones: Editar, Eliminar

**Lógica:**
```typescript
manejarEnvio(): void {
  if (!this.formulario.nombre || !this.formulario.precio) {
    alert('Completa campos requeridos');
    return;
  }

  if (this.editandoId) {
    // Actualizar
    this.productService.update(this.editandoId, objetoProducto).subscribe({
      next: () => {
        alert('¡Producto actualizado!');
        this.cargarProductos();
      }
    });
  } else {
    // Crear
    this.productService.create(objetoProducto).subscribe({
      next: () => {
        alert('¡Producto creado!');
        this.cargarProductos();
      }
    });
  }
}
```

---

## 6️⃣ COMPONENTES REUTILIZABLES

### 🎨 **Header** (`header.ts` / `header.html`)

```typescript
// Aparece en TODAS las páginas
// Contiene: Logo, botones Login/Logout, usuario autenticado
```

**Lógica:**
```typescript
export class Header {
  protected authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
```

**Template:**
```html
<header class="navbar navbar-dark bg-primary">
  <div class="container">
    <a href="/" class="navbar-brand">⚡ TechStore</a>
    @if (authService.estaAutenticado()) {
      <button (click)="logout()" class="btn btn-danger">Logout</button>
    } @else {
      <a href="/login" class="btn btn-light">Login</a>
    }
  </div>
</header>
```

---

### 🧭 **Navbar** (`navbar.ts` / `navbar.html`)

```html
<!-- Navegación SPA -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <ul class="navbar-nav">
    <li><a routerLink="/" class="nav-link">Home</a></li>
    <li><a routerLink="/acerca" class="nav-link">Acerca</a></li>
    <li><a routerLink="/servicios" class="nav-link">Servicios</a></li>
    <li><a routerLink="/contacto" class="nav-link">Contacto</a></li>
    @if (authService.estaAutenticado()) {
      <li><a routerLink="/admin" class="nav-link">🔧 Admin</a></li>
    }
  </ul>
</nav>
```

**Ventaja:** Sin recargar página, Angular actualiza la vista automáticamente

---

### 🦶 **Footer** (`footer.ts` / `footer.html`)

```html
<footer class="bg-dark text-white text-center py-4">
  <p>&copy; 2026 TechStore. Todos los derechos reservados.</p>
</footer>
```

---

## 7️⃣ TECNOLOGÍAS USADAS

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Angular** | 21.1.0 | Framework SPA |
| **TypeScript** | 5.x | Lenguaje type-safe |
| **RxJS** | 7.x | Manejo de observables (API) |
| **Bootstrap** | 5.3.2 | Estilos y componentes responsivos |
| **MockAPI** | - | API simulada para desarrollo |
| **HttpClient** | Angular | Consumo de API REST |

---

## 8️⃣ FLUJO DE DATOS (Diagrama mental)

```
1️⃣ Usuario navega a /admin
          ↓
2️⃣ AuthGuard verifica: ¿Está autenticado?
          ↓
3️⃣ Si NO → Redirige a /login
   Si SÍ → Carga AdminPanel
          ↓
4️⃣ AdminPanel llama:
   - companyService.getFresh() → GET /nosotros
   - productService.getFresh() → GET /productos
          ↓
5️⃣ MockAPI retorna JSON
          ↓
6️⃣ Los datos se muestran en la UI
          ↓
7️⃣ Usuario edita/crea/elimina
          ↓
8️⃣ Se envía a API (POST/PUT/DELETE)
          ↓
9️⃣ API confirma cambio
          ↓
🔟 Se recarga la lista automáticamente
```

---

## 9️⃣ MEJORAS RESPECTO A LA VERSIÓN ANTERIOR

| Aspecto | Versión 1 (HTML/CSS/JS) | Versión 2 (Angular) |
|--------|------------------------|-------------------|
| **Framework** | Ninguno (vanilla JS) | ✅ Angular + TypeScript |
| **Componentes** | HTML repetido | ✅ Componentes reutilizables |
| **Rutas** | Links HTML tradicionales | ✅ SPA sin recargas (RouterLink) |
| **API** | Posiblemente hardcodeada | ✅ MockAPI real + CRUD completo |
| **Autenticación** | Ninguna | ✅ AuthGuard + Login |
| **Seguridad de tipos** | No | ✅ TypeScript (errores en compile) |
| **Reactividad** | Manual (vanilla JS) | ✅ Angular signals + change detection |
| **Estilos** | CSS personalizado | ✅ Bootstrap 5.3.2 |
| **Accesibilidad** | Básica | ✅ Roles ARIA completos |

---

## 🔟 FLUJO DE DESARROLLO (¿Cómo lo hice?)

### Paso 1: Crear proyecto
```bash
ng new tech-store-angular
ng add bootstrap
```

### Paso 2: Definir rutas
Archivo: `app.routes.ts`
- Rutas públicas sin guard
- `/admin` con AuthGuard

### Paso 3: Crear servicios
- `auth.service.ts` → Login/Logout
- `company.service.ts` → API Nosotros
- `product.ts` → API Productos

### Paso 4: Crear guards
- `auth.guard.ts` → Protege /admin

### Paso 5: Crear componentes
- Header, Footer, Navbar (reutilizables)
- Home, Acerca, Servicios, Contacto (vistas públicas)
- Login, AdminPanel (admin)

### Paso 6: Conectar a MockAPI
- Configurar HttpClient
- Consumir endpoints con RxJS

### Paso 7: Validar accesibilidad
- Agregar aria-labels
- Verificar contraste
- Testing responsivo

---

## 1️⃣1️⃣ PREGUNTAS FRECUENTES EN LA DEFENSA

### ❓ "¿Qué es un Guard en Angular?"
**R:** Un Guard es una función que protege una ruta. Antes de que Angular cargue un componente, el Guard responde sí/no. Si es no, redirige a otra ruta. En nuestro caso, `AuthGuard` verifica si el usuario está autenticado antes de permitir acceso a `/admin`.

---

### ❓ "¿Cómo consumes la API?"
**R:** Uso `HttpClient` de Angular:
```typescript
this.http.get<Nosotros[]>(API_URL).pipe(map(...)).subscribe(...)
```
- `.get()` = petición GET
- `.pipe()` = transforma datos con operadores RxJS
- `.subscribe()` = se ejecuta cuando retorna la respuesta

---

### ❓ "¿Por qué usas RxJS?"
**R:** RxJS maneja datos **asincronos**. Cuando haces una petición HTTP:
1. No sabes cuándo llegará la respuesta
2. Puede fallar
3. Necesitas actualizar la UI cuando llegue

Con Observables (RxJS):
- `.subscribe()` espera la respuesta
- Si llega → actualiza la UI
- Si falla → maneja el error

---

### ❓ "¿Cómo protegiste el panel admin?"
**R:** Usé 2 capas:
1. **AuthGuard** en la ruta: `canActivate: [AuthGuard]`
2. **AuthService** que valida credenciales: `diego/diego123`

Si alguien intenta acceder a `/admin` sin estar logueado, Angular lo redirige a `/login`.

---

### ❓ "¿Qué es TransferState?"
**R:** Angular tiene SSR (Server-Side Rendering). TransferState cachea datos en el servidor para que el cliente no tenga que volver a pedir. Optimiza el rendimiento.

---

### ❓ "¿Qué es un Standalone Component?"
**R:** En Angular moderno (v14+), los componentes pueden ser "standalone". No necesitan NgModule. Es más simple:
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule]  // ← Declara dependencias locales
})
```

---

### ❓ "¿Cómo validas formularios?"
**R:** Validaciones básicas:
```typescript
if (!this.formulario.nombre || !this.formulario.precio) {
  alert('Campos requeridos');
  return;
}
```
- Verifico que no estén vacíos
- Muestro alertas claras
- No envío a API si hay errores

---

## 1️⃣2️⃣ CÓMO PRESENTAR ORALMENTE

### **Estructura de 3 minutos:**

**30 seg**: Introducción
- "Mi proyecto es TechStore, una tienda online con Angular"
- "Tiene vista pública y panel administrativo"

**60 seg**: Arquitectura
- Muestra capeta `src/app/` en VS Code
- Señala: components, guards, services, views
- Explica: servicios hacen llamadas HTTP, componentes las usan

**45 seg**: API y datos
- Muestra MockAPI en navegador
- Endpoints: `/nosotros`, `/productos`
- CRUD: GET (leer), POST (crear), PUT (actualizar), DELETE (eliminar)

**45 seg**: Demo en vivo
- Navega Home → Acerca → Servicios
- Login con diego/diego123
- Crea un producto
- Edita sección Nosotros
- Vuelve a Home y muestra que los cambios aparecen

---

## 1️⃣3️⃣ CHECKLIST ANTES DE PRESENTAR

- [ ] ¿Funciona el login con diego/diego123?
- [ ] ¿Se ve responsivo en móvil?
- [ ] ¿Puedes agregar un producto y aparece en Home?
- [ ] ¿Puedes editar Nosotros y los cambios persisten?
- [ ] ¿Hay contraste adecuado en colores?
- [ ] ¿Las imágenes cargan rápido?
- [ ] ¿Probaste eliminar un producto?
- [ ] ¿Las rutas SPA funcionan sin recargar?

---

## 1️⃣4️⃣ RESUMEN EN UNA ORACIÓN

"Construí una tienda tecnológica moderna con Angular que consume una API MockAPI, tiene autenticación protegida y permite a administradores actualizar contenido dinámicamente desde un panel intuitivo con diseño responsivo en Bootstrap."

---

**¡Buena suerte en tu defensa! 🚀**
