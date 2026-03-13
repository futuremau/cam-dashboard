import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DB_CIERRE = process.env.NOTION_DB_CIERRE_ID!;
const DB_BANCARIO = process.env.NOTION_DB_BANCARIO_ID!;

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface CierreData {
  fecha: string; // "YYYY-MM-DD"
  // Ventas Tienda
  efectivo: number;
  papeleria: number;
  posBac: number;
  posBanrural: number;
  transferencias: number;
  // Comisiones Bancarias
  comAgentes: number;
  comBac: number;
  comBanpais: number;
  comFicohsa: number;
  comTigoMoney: number;
  comBanrural: number;
  comAtlantida: number;
  comOccidente: number;
  comInteres: number;
}

export interface BancarioData {
  fecha: string; // "YYYY-MM-DD"
  // Cuentas bancarias
  bac: number;
  atlantida: number;
  ficohsa: number;
  banpais: number;
  occidente: number;
  banrural: number;
  davivienda: number;
  // Servicios digitales
  tigoMoney: number;
  rTigo: number;
  rClaro: number;
  dilo: number;
  // Efectivo
  cuentaEfectivo: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function num(value: number) {
  return { number: value || 0 };
}

// ─── Funciones principales ────────────────────────────────────────────────────

export async function createCierreRecord(data: CierreData) {
  return notion.pages.create({
    parent: { database_id: DB_CIERRE },
    properties: {
      Id: { title: [{ text: { content: data.fecha } }] },
      Fecha: { date: { start: data.fecha } },
      Efectivo: { number: data.efectivo || 0 },
      Papeleria: { number: data.papeleria || 0 },
      "POS Bac": { number: data.posBac || 0 },
      "POS Banrural": { number: data.posBanrural || 0 },
      Transferencias: { number: data.transferencias || 0 },
      "Com Agentes Diario": { number: data.comAgentes || 0 },
      "Com BAC": { number: data.comBac || 0 },
      "Com Banpais": { number: data.comBanpais || 0 },
      "Com Ficohsa": { number: data.comFicohsa || 0 },
      "Com Tigo Money": { number: data.comTigoMoney || 0 },
      "Com BanRural": { number: data.comBanrural || 0 },
      "Com Atlantida": { number: data.comAtlantida || 0 },
      "Com Occidente": { number: data.comOccidente || 0 },
      "Com interes Cuenta": { number: data.comInteres || 0 },
    },
  });
}

export async function createBancarioRecord(data: BancarioData) {
  return notion.pages.create({
    parent: { database_id: DB_BANCARIO },
    properties: {
      Id: { title: [{ text: { content: data.fecha } }] },
      Fecha: { date: { start: data.fecha } },
      BAC: { number: data.bac || 0 },
      Atlántida: { number: data.atlantida || 0 },
      Ficohsa: { number: data.ficohsa || 0 },
      BanPaís: { number: data.banpais || 0 },
      Occidente: { number: data.occidente || 0 },
      BanRural: { number: data.banrural || 0 },
      DaVivienda: { number: data.davivienda || 0 },
      "Tigo Money": { number: data.tigoMoney || 0 },
      "R. Tigo": { number: data.rTigo || 0 },
      "R. Claro": { number: data.rClaro || 0 },
      Dilo: { number: data.dilo || 0 },
      "Cuenta Efectivo": { number: data.cuentaEfectivo || 0 },
    },
  });
}

export async function getTodayStatus(fecha: string) {
  const [cierreRes, bancarioRes] = await Promise.all([
    notion.databases.query({
      database_id: DB_CIERRE,
      filter: { property: "Fecha", date: { equals: fecha } },
      page_size: 1,
    }),
    notion.databases.query({
      database_id: DB_BANCARIO,
      filter: { property: "Fecha", date: { equals: fecha } },
      page_size: 1,
    }),
  ]);

  return {
    cierre: cierreRes.results.length > 0,
    bancario: bancarioRes.results.length > 0,
  };
}

export async function getRecentRecords(limit = 30) {
  const [cierreRes, bancarioRes] = await Promise.all([
    notion.databases.query({
      database_id: DB_CIERRE,
      sorts: [{ property: "Fecha", direction: "descending" }],
      page_size: limit,
    }),
    notion.databases.query({
      database_id: DB_BANCARIO,
      sorts: [{ property: "Fecha", direction: "descending" }],
      page_size: limit,
    }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractProps = (page: any) => {
    const props = page.properties;
    const fecha = props.Fecha?.date?.start ?? "—";
    // Intentar obtener el total calculado por Notion (fórmula) o sumar manualmente
    const totalNeto = props["Total Neto"]?.formula?.number ?? null;
    const sumaDia = props["Suma por Día"]?.formula?.number ?? null;
    
    // Extracción detallada para KPIs
    const efectivo = props.Efectivo?.number ?? null;
    const posBac = props["POS Bac"]?.number ?? null;
    const bac = props.BAC?.number ?? null;
    const atlantida = props["Atlantida"]?.number ?? null;
    const ficohsa = props.Ficohsa?.number ?? null;
    const banpais = props["Banpais"]?.number ?? null;
    const occidente = props.Occidente?.number ?? null;
    const banrural = props.BanRural?.number ?? null;
    const tigoMoney = props["Tigo Money"]?.number ?? null;

    return { 
      fecha, totalNeto, sumaDia,
      efectivo, posBac, bac, atlantida, ficohsa, banpais, occidente, banrural, tigoMoney
    };
  };

  return {
    cierre: cierreRes.results.map(extractProps),
    bancario: bancarioRes.results.map(extractProps),
  };
}

export async function getRecordsByDateRange(startDate: string, endDate: string) {
  const fetchAll = async (database_id: string) => {
    let results: any[] = [];
    let has_more = true;
    let next_cursor: string | undefined = undefined;

    while (has_more) {
      const response = await notion.databases.query({
        database_id,
        filter: {
          and: [
            { property: "Fecha", date: { on_or_after: startDate } },
            { property: "Fecha", date: { on_or_before: endDate } }
          ]
        },
        sorts: [{ property: "Fecha", direction: "descending" }],
        page_size: 100,
        start_cursor: next_cursor,
      });
      
      results = results.concat(response.results);
      has_more = response.has_more;
      next_cursor = response.next_cursor ?? undefined;
    }
    return results;
  };

  const [cierreRes, bancarioRes] = await Promise.all([
    fetchAll(DB_CIERRE),
    fetchAll(DB_BANCARIO)
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractProps = (page: any) => {
    const props = page.properties;
    const fecha = props.Fecha?.date?.start ?? "—";
    const totalNeto = props["Total Neto"]?.formula?.number ?? null;
    const sumaDia = props["Suma por Día"]?.formula?.number ?? null;
    
    // Extracción detallada para KPIs
    const efectivo = props.Efectivo?.number ?? null;
    const posBac = props["POS Bac"]?.number ?? null;
    const bac = props.BAC?.number ?? null;
    const atlantida = props["Atlantida"]?.number ?? null;
    const ficohsa = props.Ficohsa?.number ?? null;
    const banpais = props["Banpais"]?.number ?? null;
    const occidente = props.Occidente?.number ?? null;
    const banrural = props.BanRural?.number ?? null;
    const tigoMoney = props["Tigo Money"]?.number ?? null;

    return { 
      fecha, totalNeto, sumaDia,
      efectivo, posBac, bac, atlantida, ficohsa, banpais, occidente, banrural, tigoMoney
    };
  };

  return {
    cierre: cierreRes.map(extractProps),
    bancario: bancarioRes.map(extractProps),
  };
}
