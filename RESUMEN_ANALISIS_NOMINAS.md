# Analisis Nominas Klarna - Marc Navarro Calixtro
**Fecha del analisis: 25 Marzo 2026**

---

## 1. Datos Generales
- **Empresa:** Klarna Spain, S.L. (NIF: B88639240) - gestionado por Deel (EOR)
- **Categoria:** Titulado Grado Superior (Grupo 1)
- **Antiguedad:** Marzo 2023 (primera nomina: Julio 2023)
- **Base cotizacion SS:** Topada a 5.101,20 EUR/mes (2026)

## 2. Evolucion Salarial (sin RSUs)

| Periodo | Salario Base | Mejora Voluntaria | Bruto Anual | Cambio |
|---------|-------------|-------------------|-------------|--------|
| Jul 2023 | 1.807,80 | 2.829,78 | 59.267 | - |
| Ago 2023 | 1.807,80 | 3.007,15 | 61.395 | +2.128 (regularizacion alta) |
| Feb 2024 | 2.133,06 | 2.700,16 | 62.265 | +870 (convenio/CPI) |
| Jul 2024 | 2.133,06 | ~2.761 | 62.992 | +727 (revision anual) |
| Ene 2025 | 2.133,06 | ~2.770 | 63.098 | +106 (ajuste menor) |
| **Jul 2025** | **2.133,06** | **~3.234** | **68.672** | **+5.574 (conversion RSU→salario)** |

- **Crecimiento organico (sin conversion RSU):** +2,8% en 22 meses (~1,5% anual)
- **3 subidas organicas** en casi 3 anos (convenio + revision anual modesta)
- **La subida de Jul 2025 (+5.574/año)** compensa los ~6K anuales en RSU grants periodicos que dejaron de otorgarse con la IPO

## 3. Cartera RSU

### 3.1 Acciones reales (Klarna Group PLC - NYSE: KLAR)
- **499 acciones** en cuenta JP Morgan Securities
  - 420 shares @ $40,00 FMV (Exchange Issuance 11-Sep-2025, dia IPO)
  - 79 shares @ $36,56 FMV (Exchange Issuance 24-Oct-2025)
- **~79 acciones adicionales** pendientes de transferir (vesting Ene 2026)
- **Precio actual:** $13,55 (24-Mar-2026)
- **Valor actual:** $6.761 | **Perdida no realizada:** -$12.927 (-65,7%)

### 3.2 RSUs pendientes de vestear (Larkan AB)
- **5.300 unidades** en 4 grants
- Vesting trimestral (~572 uds/trimestre), hasta julio 2028
- Conversion: 4 Larkan AB units = 1 Klarna PLC share
- JP Morgan retiene ~45% por "Withhold to Cover"

### 3.3 Grants
| Grant | Fecha | Total | Vested | Pendiente |
|-------|-------|-------|--------|-----------|
| APR-2023 (NP) | 24-Abr-2023 | 365 | 251 | 114 |
| JUL-2023 (AP) | 24-Jul-2023 | 1.195 | 747 | 448 |
| JUL-2024 (AP) | 23-Jul-2024 | 1.147 | 430 | 717 |
| JUL-2024 (CBR) | 23-Jul-2024 | 6.435 | 2.414 | 4.021 |
| **Total** | | **9.142** | **3.842** | **5.300** |

### 3.4 Proximo vesting
- **01-Abr-2026:** 572 unidades → ~257 retenidas → ~315 emitidas → ~79 acciones PLC

## 4. Reimbursement Withheld (hallazgo clave)

Aparece **4 veces** en todo el historico, siempre vinculado a RSUs:

| Mes | Importe | RSU asociada |
|-----|---------|-------------|
| May 2025 (off-cycle) | 347,76 | RSU Residuals 772,79 |
| Jul 2025 | 6.553,55 | RSU Residuals 14.502,22 |
| Nov 2025 | 2.024,02 | Vested RSU 4.478,86 |
| Mar 2026 | 1.573,97 | Vested RSU 3.479,15 |
| **Total** | **10.499,30** | |

**Causa:** JP Morgan retiene ~45% de acciones (tasa internacional generica), pero IRPF espanol real es ~33-37%. La diferencia (~8-10%) se devuelve como "Reimbursement Withheld".

## 5. Flujo de impuestos RSU (como funciona)

```
RSUs vestean en JP Morgan
    │
    ├── ~55% acciones → empleado (cuenta JPMS)
    │
    └── ~45% acciones → devueltas a Klarna
              │
              ├── ~37% → Klarna paga IRPF a Hacienda (via nomina Deel)
              └── ~8%  → devuelto al empleado como "Reimbursement Withheld"

En la nomina: RSU aparece como devengo + deduccion especie = efecto cash 0
El impuesto se paga UNA sola vez (por Klarna con las acciones retenidas)
```

## 6. Impacto de la IPO (10-Sep-2025)

La salida a bolsa causo estos cambios en las nominas:
1. **Nuevo concepto "Reimbursement Withheld"** (desde May 2025, preparacion IPO)
2. **Cambio de nombre:** "Share Award" → "Vested RSU"
3. **Conversion de acciones:** Larkan AB → Klarna Group PLC (ratio 4:1)
4. **Subida salarial Jul 2025:** +5.574/año para compensar fin de grants periodicos
5. **Modelo WTC obligatorio** para Espana (no se puede cambiar a cash settlement)

## 7. Politica actual RSU (segun wiki Klarna, Mar 2026)

- **Withhold-to-Cover es obligatorio** para Klarna Spain S.L.
- No hay opcion de cash settlement para empleados en Espana
- Se aplica el tipo marginal mas alto (~45%) para evitar infra-retencion
- Exceso se devuelve via nomina o declaracion IRPF
- Canal de consultas: #tm-equity-and-compensation-dm-people (Slack)
- Wiki relevante: wiki.klarna.net/wiki/RSU_Taxation_&_Withholding_Shares_to_Cover_Tax_Policy

## 8. Tipo IRPF - Evolucion

| Periodo | IRPF % |
|---------|--------|
| Jul-Dic 2023 | 25,00% |
| Ene 2024 | 25,10% |
| Feb 2024 | 24,97% |
| Mar-Jun 2024 | ~25% |
| Jul-Sep 2024 | 26,15% |
| Oct-Dic 2024 | ~27,5-28,5% |
| Ene 2025 | 27,20% |
| Feb-Jun 2025 | ~26,4-27,1% |
| Jul 2025 | 32,42% |
| Ago-Dic 2025 | 32-37% |
| Ene 2026 | 31,45% |
| Feb-Mar 2026 | 33,05% |

Subida significativa desde Jul 2025 por el aumento de base imponible (RSU vestings grandes + subida salarial).

## 9. Proyeccion de vestings futuros y impacto en nomina

### 9.1 Calendario de vestings → nominas

Deel procesa cada vesting con ~1 mes de delay.

| Fecha Vesting | Uds. vest | Grants activos | Nomina esperada |
|--------------|-----------|----------------|-----------------|
| 01-Abr-2026 | 572 | APR23 + JUL23 + JUL24-AP + JUL24-CBR | **May 2026** |
| 01-Jul-2026 | 572 | APR23 + JUL23 + JUL24-AP + JUL24-CBR | **Ago 2026** |
| 01-Oct-2026 | 572 | APR23 + JUL23 + JUL24-AP + JUL24-CBR | **Nov 2026** |
| 01-Ene-2027 | 570 | APR23 + JUL23 + JUL24-AP + JUL24-CBR | **Feb 2027** |
| 01-Abr-2027 | 572 | APR23 + JUL23 + JUL24-AP + JUL24-CBR | **May 2027** |
| 01-Jul-2027 | 548 | JUL23 + JUL24-AP + JUL24-CBR | **Ago 2027** |
| 01-Oct-2027 | 474 | JUL24-AP + JUL24-CBR | **Nov 2027** |
| 01-Ene-2028 | 473 | JUL24-AP + JUL24-CBR | **Feb 2028** |
| 01-Abr-2028 | 474 | JUL24-AP + JUL24-CBR | **May 2028** |
| 01-Jul-2028 | 473 | JUL24-AP + JUL24-CBR | **Jul/Ago 2028** |

- A partir de Jul 2027 bajan las unidades (se acaba grant APR-2023)
- A partir de Oct 2027 se acaba tambien JUL-2023 (solo quedan los JUL-2024)
- **Ultimo vesting: Jul 2028** - despues, nomina = solo salario fijo

### 9.2 Expiracion de grants

| Grant | Ultimo vesting | Uds. restantes a esa fecha |
|-------|---------------|---------------------------|
| APR-2023 (NP) | Abr 2027 | 0 |
| JUL-2023 (AP) | Jul 2027 | 0 |
| JUL-2024 (AP) | Jul 2028 | 0 |
| JUL-2024 (CBR) | Jul 2028 | 0 |

### 9.3 Acciones PLC que recibiras por vesting

Cada vesting: ~55% de unidades emitidas → conversion 4:1 a PLC → ~79 acciones PLC netas (para vestings de ~572 uds). Para vestings menores (474 uds), ~65 acciones PLC netas.

| Periodo | Vestings | PLC shares netas estimadas |
|---------|----------|---------------------------|
| 2026 (Abr-Oct) | 3 vestings × 572 uds | ~237 acciones PLC |
| 2027 (Ene-Oct) | 4 vestings (572→474 uds) | ~278 acciones PLC |
| 2028 (Ene-Jul) | 3 vestings × ~473 uds | ~195 acciones PLC |
| **Total restante** | **10 vestings** | **~710 acciones PLC** |

### 9.4 Impacto cash en nomina (Reimbursement Withheld)

Las RSUs son especie (efecto cash = 0 en nomina). El unico cash extra es el "Reimbursement Withheld" (exceso de retencion JP Morgan 45% vs IRPF real ~33%).

Estimacion en 3 escenarios de precio KLAR:

| Precio KLAR | Reimb. por vesting (~572 uds) | Reimb. por vesting (~474 uds) |
|------------|------------------------------|------------------------------|
| $13,55 (actual) | ~€500-700 | ~€400-600 |
| $25 (recuperacion) | ~€1.200-1.500 | ~€1.000-1.200 |
| $40 (precio IPO) | ~€2.000-2.500 | ~€1.700-2.100 |

Referencia real: en Mar 2026 (vest Ene-26, KLAR ~$29), cobraste 1.573,97 EUR de reimbursement.

### 9.5 Meses con nomina mas alta (resumen visual)

```
2026:  Abr     MAY$$   Jun     Jul     AGO$$   Sep     Oct     NOV$$   Dic
2027:  Ene     FEB$$   Mar     Abr     MAY$$   Jun     Jul     AGO$$   Sep     Oct     NOV$$   Dic
2028:  Ene     FEB$$   Mar     Abr     MAY$$   Jun     JUL$$

$$ = nomina con vesting procesado (liquido mas alto por Reimbursement Withheld)
```

10 nominas con extra entre mayo 2026 y julio 2028. Despues: solo salario fijo (~68.672 EUR/año).
