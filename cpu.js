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
    const MEM_BUFFER_SIZE                   = (MEM_RAM_SIZE + MEM_DISPLAY1_SIZE + MEM_DISPLAY2_SIZE + MEM_IO_SIZE)/2;


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
