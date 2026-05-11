
interface Holiday {
  fecha: string;
  nombre: string;
  tipo: string;
}

export const showTodayFn = async (): Promise<boolean> => {
  
  const todayDate = new Date();
  const dayOfWeek = todayDate.getDay();
  
  // 0 es Domingo, 6 es Sábado
  const isWeekend: boolean = dayOfWeek === 0 || dayOfWeek === 6;

  // Si es fin de semana, NO se debe mostrar
  if (isWeekend) return false;

  const isHoliday = await checkHoliday();

  // Si es feriado (true), NO se debe mostrar (devolvemos el opuesto)
  return !isHoliday; 

};

const checkHoliday = async (): Promise<boolean | undefined> => {

  try {

    const currentYear = new Date().getFullYear();
    
    const response = await fetch(`https://api.argentinadatos.com/v1/feriados/${currentYear}`);
    
    if (!response.ok) throw new Error("Error en la respuesta de la red");

    const holidays: Holiday[] = await response.json();

    const todayStr = new Date().toISOString().slice(0, 10);
    
    return holidays.some( holiday => holiday.fecha === todayStr );

  } catch (error) {

    console.error("Error al obtener feriados:", error);
    return false; // En caso de error asumimos que no es feriado

  }

};