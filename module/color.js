export function RGB_to_HEX({ R, G, B }) {
	const HEX = [R, G, B].map(v => ('0' + v.toString(16)).slice(-2).toUpperCase())
	return `#${HEX.join('')}`
}
export function HEX_to_RGB(HEX) {
	const R = parseInt(HEX.slice(1, 3), 16)
	const G = parseInt(HEX.slice(3, 5), 16)
	const B = parseInt(HEX.slice(5, 7), 16)
	return { R, G, B }
}
export function RGB_to_HSL({ R, G, B }) {
	const MAX = Math.max(R, G, B)
	const MIN = Math.min(R, G, B)
	let H
	if (MIN === MAX) {
		H = 0
	} else if (R === MAX) {
		H = 60 * ((G - B) / (MAX - MIN))
	} else if (G === MAX) {
		H = 60 * ((B - R) / (MAX - MIN)) + 120
	} else if (B === MAX) {
		H = 60 * ((R - G) / (MAX - MIN)) + 240
	}
	let L = (MIN + MAX) / 2
	let S
	if (L === 0 || L === 255) {
		S = 0
	} else if (L <= 127) {
		S = (L - MIN) / L
	} else {
		S = (MAX - L) / (255 - L)
	}
	H = int(H)
	S = int(S * 100)
	L = int((L * 100) / 255)
	return { H, S, L }
}
export function HSL_to_RGB({ H, S, L }) {
	const tL = 50 < L ? 100 - L : L
	const MAX = 2.55 * (L + tL * (S / 100))
	const MIN = 2.55 * (L - tL * (S / 100))
	let dH
	if (0 < H && H <= 60) {
		dH = 0
	} else if (60 < H && H <= 180) {
		dH = 120
	} else if (180 < H && H <= 300) {
		dH = 240
	} else if (300 < H && H <= 360) {
		dH = 360
	}
	const X = ((H % 120 <= 60 ? H - dH : dH - H) / 60) * (MAX - MIN) + MIN
	const R = HSL_to_RGB_rota((H + 120) % 360, MIN, MAX, X)
	const G = HSL_to_RGB_rota(H, MIN, MAX, X)
	const B = HSL_to_RGB_rota((H + 240) % 360, MIN, MAX, X)
	return { R, G, B }
}
function HSL_to_RGB_rota(H, MIN, MAX, X) {
	if (60 < H && H <= 180) {
		return int(MAX)
	} else if (240 < H && H <= 360) {
		return int(MIN)
	} else {
		return int(X)
	}
}
function int(n) {
	return Math.floor(Number(n))
}
