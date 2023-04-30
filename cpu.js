//cpu.h
const _CPU_H                                = 1;
 
const MEMORY_SIZE                           = 4096;
 
const MEM_RAM_ADDR 		                    = 0x000;
const MEM_RAM_SIZE		                    = 0x280;
const MEM_DISPLAY1_ADDR	                    = 0xE00;
const MEM_DISPLAY1_SIZE	                    = 0x050;
const MEM_DISPLAY2_ADDR	                    = 0xE80;
const MEM_DISPLAY2_SIZE	                    = 0x050;
const MEM_IO_ADDR		                    = 0xF00;
const MEM_IO_SIZE		                    = 0x080;

/* Asign the value 1 to this if you want to reduce the footprint of the memory buffer from 4096 u4_t (most likely bytes)
 * to 464 u8_t (bytes for sure), while increasing slightly the number of operations needed to read/write from/to it.
 */
const LOW_FOOTPRINT                         = 1;

if (LOW_FOOTPRINT == 1)
{
    /* Invalid memory areas are not buffered to reduce the footprint of the library in memory */
    const MEM_BUFFER_SIZE                   = () => (MEM_RAM_SIZE + MEM_DISPLAY1_SIZE + MEM_DISPLAY2_SIZE + MEM_IO_SIZE)/2;


    /* Maps the CPU memory to the memory buffer */
    const RAM_TO_MEMORY                         = (n) => ((n - MEM_RAM_ADDR) / 2);
    const DISP1_TO_MEMORY                       = (n) => ((n - MEM_DISPLAY1_ADDR + MEM_RAM_SIZE)/2);
    const DISP2_TO_MEMORY                       = (n) => ((n - MEM_DISPLAY2_ADDR + MEM_RAM_SIZE + MEM_DISPLAY1_SIZE)/2);
    const IO_TO_MEMORY                          = (n) => ((n - MEM_IO_ADDR + MEM_RAM_SIZE + MEM_DISPLAY1_SIZE + MEM_DISPLAY2_SIZE)/2);

    const SET_RAM_MEMORY                        = (buffer, n, v) =>{buffer[RAM_TO_MEMORY(n)] = (buffer[RAM_TO_MEMORY(n)] & ~(0xF << (((n) % 2) << 2))) | ((v) & 0xF) << (((n) % 2) << 2);};
    const SET_DISP1_MEMORY                      = (buffer, n, v) =>{buffer[DISP1_TO_MEMORY(n)] = (buffer[DISP1_TO_MEMORY(n)] & ~(0xF << (((n) % 2) << 2))) | ((v) & 0xF) << (((n) % 2) << 2);};
    const SET_DISP2_MEMORY                      = (buffer, n, v) =>{buffer[DISP2_TO_MEMORY(n)] = (buffer[DISP2_TO_MEMORY(n)] & ~(0xF << (((n) % 2) << 2))) | ((v) & 0xF) << (((n) % 2) << 2);};
    const SET_IO_MEMORY                         = (buffer, n, v) =>{buffer[IO_TO_MEMORY(n)] = (buffer[IO_TO_MEMORY(n)] & ~(0xF << (((n) % 2) << 2))) | ((v) & 0xF) << (((n) % 2) << 2);};
    const SET_MEMORY                            = (buffer, n, v) => {
                                                    if ((n) < (MEM_RAM_ADDR + MEM_RAM_SIZE)) {
                                                        SET_RAM_MEMORY(buffer, n, v);
                                                    } else if ((n) < MEM_DISPLAY1_ADDR) {
                                                        /* INVALID_MEMORY */ 
                                                    } else if ((n) < (MEM_DISPLAY1_ADDR + MEM_DISPLAY1_SIZE)) { 
                                                        SET_DISP1_MEMORY(buffer, n, v); 
                                                    } else if ((n) < MEM_DISPLAY2_ADDR) { 
                                                        /* INVALID_MEMORY */ 
                                                    } else if ((n) < (MEM_DISPLAY2_ADDR + MEM_DISPLAY2_SIZE)) { 
                                                        SET_DISP2_MEMORY(buffer, n, v); 
                                                    } else if ((n) < MEM_IO_ADDR) { 
                                                        /* INVALID_MEMORY */ 
                                                    } else if ((n) < (MEM_IO_ADDR + MEM_IO_SIZE)) { 
                                                        SET_IO_MEMORY(buffer, n, v); 
                                                    } else { 
                                                        /* INVALID_MEMORY */ 
                                                    }
                                                };

    const GET_RAM_MEMORY                        = (buffer, n) =>((buffer[RAM_TO_MEMORY(n)] >> (((n) % 2) << 2)) & 0xF);
    const GET_DISP1_MEMORY                      = (buffer, n) =>((buffer[DISP1_TO_MEMORY(n)] >> (((n) % 2) << 2)) & 0xF);
    const GET_DISP2_MEMORY                      = (buffer, n) =>((buffer[DISP2_TO_MEMORY(n)] >> (((n) % 2) << 2)) & 0xF);
    const GET_IO_MEMORY                         = (buffer, n) =>((buffer[IO_TO_MEMORY(n)] >> (((n) % 2) << 2)) & 0xF);
    const GET_MEMORY                            = (buffer, n) => {
                                                    ((buffer[
                                                    ((n) < (MEM_RAM_ADDR + MEM_RAM_SIZE)) ? RAM_TO_MEMORY(n) :
                                                    ((n) < MEM_DISPLAY1_ADDR) ? 0 :
                                                    ((n) < (MEM_DISPLAY1_ADDR + MEM_DISPLAY1_SIZE)) ? DISP1_TO_MEMORY(n) :
                                                    ((n) < MEM_DISPLAY2_ADDR) ? 0 :
                                                    ((n) < (MEM_DISPLAY2_ADDR + MEM_DISPLAY2_SIZE)) ? DISP2_TO_MEMORY(n) :
                                                    ((n) < MEM_IO_ADDR) ? 0 :
                                                    ((n) < (MEM_IO_ADDR + MEM_IO_SIZE)) ? IO_TO_MEMORY(n) : 0
                                                    ] >> (((n) % 2) << 2)) & 0xF)
                                                };

    //#define MEM_BUFFER_TYPE				u8_t
} else {
    const MEM_BUFFER_SIZE                       = MEMORY_SIZE;

    const SET_MEMORY                            = (buffer, n, v) => {buffer[n] = v;}
    const SET_RAM_MEMORY                        = (buffer, n, v) => SET_MEMORY(buffer, n, v);
    const SET_DISP1_MEMORY                      = (buffer, n, v) => SET_MEMORY(buffer, n, v);
    const SET_DISP2_MEMORY                      = (buffer, n, v) => SET_MEMORY(buffer, n, v);
    const SET_IO_MEMORY                         = (buffer, n, v) => SET_MEMORY(buffer, n, v);
    //TODO check should I return or does it automatically work?
    const GET_MEMORY                            = (buffer, n) => (buffer[n]);
    const GET_RAM_MEMORY                        = (buffer, n) => GET_MEMORY(buffer, n);
    const GET_DISP1_MEMORY                      = (buffer, n) => GET_MEMORY(buffer, n);
    const GET_DISP2_MEMORY                      = (buffer, n) => GET_MEMORY(buffer, n);
    const GET_IO_MEMORY                         = (buffer, n) => GET_MEMORY(buffer, n);

    //#define MEM_BUFFER_TYPE				u4_t
}

class breakpoint_t {
    constructor(addr, next) {
        this.addr = addr;
        this.next = next;
    }
}

const pin_t = {
    PIN_K00: 0x0,
    PIN_K01: 0x1,
    PIN_K02: 0x2,
    PIN_K03: 0x3,
    PIN_K10: 0x4,
    PIN_K11: 0x5,
    PIN_K12: 0x6,
    PIN_K13: 0x7,
};

const pin_state_t = {
    PIN_STATE_LOW: 0,
	PIN_STATE_HIGH: 1,
};

const int_slot_t = {
	INT_PROG_TIMER_SLOT: 0,
	INT_SERIAL_SLOT: 1,
	INT_K10_K13_SLOT: 2,
	INT_K00_K03_SLOT: 3,
	INT_STOPWATCH_SLOT: 4,
	INT_CLOCK_TIMER_SLOT: 5,
	INT_SLOT_NUM: 6, //TODO check
};

class interrupt_t {
    constructor(factor_flag_reg, mask_reg, triggered, vector) {
        this.factor_flag_reg = factor_flag_reg;
        this.mask_reg = mask_reg;
        this.triggered = triggered; /* 1 if triggered, 0 otherwise */
        this.vector = vector;
    }
}

const state_t = {
    pc: null,
    x: null,
    y: null,
    a: null,
    b: null,
    np: null,
    sp: null,
    flags: null,

    tick_counter: null,
    clk_timer_timestamp: null,
    prog_timer_timestamp: null,
    prog_timer_enabled: null,
    prog_timer_data: null,
    prog_timer_rld: null,

    call_depth: null,

    interrupts: null,

    memory: null
};

//cpu.c
const TICK_FREQUENCY                                = 32768; // Hz

const TIMER_1HZ_PERIOD                              = 32768; // in ticks
const TIMER_256HZ_PERIOD                            = 128; // in ticks

const MASK_4B                                       = 0xF00;
const MASK_6B                                       = 0xFC0;
const MASK_7B                                       = 0xFE0;
const MASK_8B                                       = 0xFF0;
const MASK_10B                                      = 0xFFC;
const MASK_12B                                      = 0xFFF;

const PCS                                           = () => (pc & 0xFF);
const PCSL                                          = () => (pc & 0xF);
const PCSH                                          = () => ((pc >> 4) & 0xF);
const PCP                                           = () => ((pc >> 8) & 0xF);
const PCB                                           = () => ((pc >> 12) & 0x1);
const TO_PC                                         = (bank, page, step)=> ((step & 0xFF) | ((page & 0xF) << 8) | (bank & 0x1) << 12);
const NBP                                           = () => ((np >> 4) & 0x1);
const NPP                                           = () => (np & 0xF);
const TO_NP                                         = (bank, page) => ((page & 0xF) | (bank & 0x1) << 4);
const XHL                                           = () => (x & 0xFF);
const XL                                            = () => (x & 0xF);
const XH                                            = () => ((x >> 4) & 0xF);
const XP                                            = () => ((x >> 8) & 0xF);
const YHL                                           = () => (y & 0xFF);
const YL                                            = () => (y & 0xF);
const YH                                            = () => ((y >> 4) & 0xF);
const YP                                            = () => ((y >> 8) & 0xF);
const M                                             = (n) => get_memory(n);
const SET_M                                         = (n, v) =>	set_memory(n, v);
const RQ                                            = (i) => get_rq(i);
const SET_RQ                                        = (i, v) =>	set_rq(i, v);
const SPL                                           = () => (sp & 0xF);
const SPH                                           = () => ((sp >> 4) & 0xF);

const FLAG_C                                        = (0x1 << 0);
const FLAG_Z                                        = (0x1 << 1);
const FLAG_D                                        = (0x1 << 2);
const FLAG_I                                        = (0x1 << 3);

const C                                             = () => !!(flags & FLAG_C);
const Z                                             = () => !!(flags & FLAG_Z);
const D                                             = () => !!(flags & FLAG_D);
const I                                             = () => !!(flags & FLAG_I);

function SET_C() {flags |= FLAG_C;}
function CLEAR_C() {flags &= ~FLAG_C;}
function SET_Z() {flags |= FLAG_Z;}
function CLEAR_Z() {flags &= ~FLAG_Z;}
function SET_D() {flags |= FLAG_D;}
function CLEAR_D() {flags &= ~FLAG_D;}
function SET_I() {flags |= FLAG_I;}
function CLEAR_I() {flags &= ~FLAG_I;}

const REG_CLK_INT_FACTOR_FLAGS                      = 0xF00;
const REG_SW_INT_FACTOR_FLAGS                       = 0xF01;
const REG_PROG_INT_FACTOR_FLAGS                     = 0xF02;
const REG_SERIAL_INT_FACTOR_FLAGS	                = 0xF03;
const REG_K00_K03_INT_FACTOR_FLAGS                  = 0xF04;
const REG_K10_K13_INT_FACTOR_FLAGS                  = 0xF05;
const REG_CLOCK_INT_MASKS                           = 0xF10;
const REG_SW_INT_MASKS                              = 0xF11;
const REG_PROG_INT_MASKS                            = 0xF12;
const REG_SERIAL_INT_MASKS                          = 0xF13;
const REG_K00_K03_INT_MASKS                         = 0xF14;
const REG_K10_K13_INT_MASKS                         = 0xF15;
const REG_PROG_TIMER_DATA_L                         = 0xF24;
const REG_PROG_TIMER_DATA_H                         = 0xF25;
const REG_PROG_TIMER_RELOAD_DATA_L                  = 0xF26;
const REG_PROG_TIMER_RELOAD_DATA_H                  = 0xF27;
const REG_K00_K03_INPUT_PORT                        = 0xF40;
const REG_K10_K13_INPUT_PORT                        = 0xF42;
const REG_K40_K43_BZ_OUTPUT_PORT                    = 0xF54;
const REG_CPU_OSC3_CTRL                             = 0xF70;
const REG_LCD_CTRL                                  = 0xF71;
const REG_LCD_CONTRAST                              = 0xF72;
const REG_SVD_CTRL                                  = 0xF73;
const REG_BUZZER_CTRL1                              = 0xF74;
const REG_BUZZER_CTRL2                              = 0xF75;
const REG_CLK_WD_TIMER_CTRL                         = 0xF76;
const REG_SW_TIMER_CTRL                             = 0xF77;
const REG_PROG_TIMER_CTRL                           = 0xF78;
const REG_PROG_TIMER_CLK_SEL                        = 0xF79;

const INPUT_PORT_NUM                                = 2;

const op_t = {
    log: null,
    code: 0,
    mask: 0,
    shift_arg0: 0,
    mask_arg0: 0,                                   // != 0 only if there are two arguments
    cycles: 0,
    cb: null
};

const input_port_t {
    states: 0
};

/* Registers */
let pc                                              = 0;
let next_pc                                         = 0;
let x                                               = 0;
let y                                               = 0;
let a                                               = 0;
let b                                               = 0;
let np                                              = 0;
let sp                                              = 0;

/* Flags */
let flags                                           = 0;

const g_program                                     = null;
let memory                                          = new Array(MEM_BUFFER_SIZE);

let inputs                                          = new Array(INPUT_PORT_NUM).fill(0);

/* Interrupts (in priority order) */
const interrupts = [
    { factorFlagReg: 0x0, maskReg: 0x0, triggered: false, vector: 0x0C }, // Prog timer
    { factorFlagReg: 0x0, maskReg: 0x0, triggered: false, vector: 0x0A }, // Serial interface
    { factorFlagReg: 0x0, maskReg: 0x0, triggered: false, vector: 0x08 }, // Input (K10-K13)
    { factorFlagReg: 0x0, maskReg: 0x0, triggered: false, vector: 0x06 }, // Input (K00-K03)
    { factorFlagReg: 0x0, maskReg: 0x0, triggered: false, vector: 0x04 }, // Stopwatch timer
    { factorFlagReg: 0x0, maskReg: 0x0, triggered: false, vector: 0x02 }, // Clock timer
];

let g_breakpoints                                   = null;

let call_depth = 0;

let clk_timer_timestamp                             = 0; // in ticks
let prog_timer_timestamp                            = 0; // in ticks
let prog_timer_enabled                              = 0;
let prog_timer_data                                 = 0;
let prog_timer_rld                                  = 0;

let tick_counter                                    = 0;
let ts_freq                                         = 0;
let speed_ratio                                     = 1;
let ref_ts                                          = 0;

let cpu_state = {
    pc: pc,
    x: x,
    y: y,
    a: a,
    b: b,
    np: np,
    sp: sp,
    flags: flags,

    tick_counter: tick_counter,
    clk_timer_timestamp: clk_timer_timestamp,
    prog_timer_timestamp: prog_timer_timestamp,
    prog_timer_enabled: prog_timer_enabled,
    prog_timer_data: prog_timer_data,
    prog_timer_rld: prog_timer_rld,

    call_depth: call_depth,

    interrupts: interrupts,

    memory: memory
};

//line 190
function cpu_add_bp(list, addr) {
    let bp = {};

    bp.addr = addr;

    if (list !== null) {
        bp.next = list;
    } else {
        // List is empty
        bp.next = null;
    }

    list = bp;
}

