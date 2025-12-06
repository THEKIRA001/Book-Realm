import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";
import { Book } from "../models/book.model";

@Injectable({
    providedIn: 'root'
})
export class BooksService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/books`;

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl);
    }

    getBookById(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/${id}`);
    }
}