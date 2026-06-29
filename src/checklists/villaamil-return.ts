import type { ChecklistTemplate } from '@/types/index'

export const villaamilReturn: ChecklistTemplate = {
  id: 'return',
  title: 'Apertura del piso',
  subtitle: 'Villaamil · Madrid',
  description: 'Checklist de apertura al llegar a Madrid',
  icon: '🏠',
  completionMessage: '¡El piso está listo! Bienvenido de vuelta.',
  notesLabel: 'Notas de la llegada',
  notesPlaceholder: 'Estado del piso al llegar, incidencias, cosas a comprar…',
  builtIn: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  sections: [
    {
      id: 'entrada',
      title: 'Entrada',
      icon: '🔑',
      order: 1,
      tasks: [
        { id: 'ret-ent-1', title: 'Abrir la puerta principal', order: 1 },
        { id: 'ret-ent-2', title: 'Comprobar visualmente el estado de la entrada', order: 2 },
      ],
    },
    {
      id: 'instalaciones',
      title: 'Instalaciones generales',
      icon: '💧',
      order: 2,
      tasks: [
        { id: 'ret-gen-1', title: 'Abrir la llave general del agua', critical: true, order: 1 },
        { id: 'ret-gen-2', title: 'Revisar que no haya fugas tras abrir el agua', critical: true, order: 2 },
        { id: 'ret-gen-3', title: 'Encender el calentador de agua', critical: true, order: 3 },
      ],
    },
    {
      id: 'cocina',
      title: 'Cocina',
      icon: '🍽',
      order: 3,
      tasks: [
        { id: 'ret-coc-1', title: 'Conectar el frigorífico', order: 1 },
        { id: 'ret-coc-2', title: 'Esperar al menos 2 horas antes de llenarlo', note: 'Tiempo recomendado por el fabricante para que el compresor se estabilice', order: 2 },
        { id: 'ret-coc-3', title: 'Cerrar las puertas del frigorífico', order: 3 },
        { id: 'ret-coc-4', title: 'Conectar el microondas', order: 4 },
        { id: 'ret-coc-5', title: 'Conectar el air fryer', order: 5 },
        { id: 'ret-coc-6', title: 'Revisar grifos de cocina', order: 6 },
      ],
    },
    {
      id: 'lavadero',
      title: 'Lavadero',
      icon: '🧺',
      order: 4,
      tasks: [
        { id: 'ret-lav-1', title: 'Abrir llaves de paso de lavadora y lavavajillas si se cerraron', order: 1 },
        { id: 'ret-lav-2', title: 'Cerrar la puerta de la lavadora', order: 2 },
        { id: 'ret-lav-3', title: 'Cerrar la puerta del lavavajillas', order: 3 },
      ],
    },
    {
      id: 'dormitorio',
      title: 'Dormitorio',
      icon: '🛏',
      order: 5,
      tasks: [
        { id: 'ret-dorm-1', title: 'Conectar el router', note: 'Está guardado en la gaveta de la cama, la más cercana al armario', order: 1 },
        { id: 'ret-dorm-2', title: 'Esperar a que el router tenga conexión', order: 2 },
        { id: 'ret-dorm-3', title: 'Conectar los ventiladores', order: 3 },
      ],
    },
    {
      id: 'salon',
      title: 'Salón',
      icon: '🛋',
      order: 6,
      tasks: [
        { id: 'ret-sal-1', title: 'Abrir ventanas para ventilar el piso', order: 1 },
        { id: 'ret-sal-2', title: 'Revisar persianas', order: 2 },
        { id: 'ret-sal-3', title: 'Comprobar electricidad y enchufes', order: 3 },
        { id: 'ret-sal-4', title: 'Encender luces para comprobar que funcionan', order: 4 },
      ],
    },
    {
      id: 'bano',
      title: 'Baño',
      icon: '🚿',
      order: 7,
      tasks: [
        { id: 'ret-ban-1', title: 'Abrir el grifo para purgar el agua de las tuberías', order: 1 },
        { id: 'ret-ban-2', title: 'Revisar que no haya humedad ni olores', order: 2 },
        { id: 'ret-ban-3', title: 'Comprobar el funcionamiento del calentador', order: 3 },
      ],
    },
    {
      id: 'revision',
      title: 'Revisión final',
      icon: '✅',
      order: 8,
      tasks: [
        { id: 'ret-rev-1', title: 'Recorrer todas las habitaciones', order: 1 },
        { id: 'ret-rev-2', title: 'Revisar olores o humedad en general', order: 2 },
        { id: 'ret-rev-3', title: 'Confirmar que todo está en orden', order: 3 },
      ],
    },
  ],
}
