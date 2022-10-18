import { NextResponse } from "next/server";

export function middleware(req, ev) {
	console.log("It Ran");
	return NextResponse.next();
}
