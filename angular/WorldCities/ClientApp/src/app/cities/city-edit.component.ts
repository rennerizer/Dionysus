import { Component, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { City } from './city';
import { Country } from './../countries/country';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent {

  title: string;

  form: FormGroup;

  city: City;

  id?: number;

  countries: Country[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lon: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required)
    }, null, this.isDupeCity());

    this.loadData();
  }

  loadData() {
    this.loadCountries();

    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id) {
      const url = this.baseUrl + 'api/cities/' + this.id;

      this.http.get<City>(url).subscribe(result => {
        this.city = result;
        this.title = "Edit - " + this.city.name;
        this.form.patchValue(this.city);
      }, error => console.error(error));
    }
    else {
      this.title = "Create a new City";
    }
  }

  loadCountries() {
    const url = this.baseUrl + 'api/countries';

    const params = new HttpParams()
      .set("pageSize", "9999")
      .set("sortColumn", "name")
      .set("sortOrder", "asc");

    this.http.get<any>(url, { params }).subscribe(result => {
      this.countries = result.data;
    }, error => console.error(error));
  }

  onSubmit() {

    let city = (this.id) ? this.city : <City>{};

    city.name = this.form.get("name").value;
    city.lat = +this.form.get("lat").value;
    city.lon = +this.form.get("lon").value;
    city.countryId = +this.form.get("countryId").value;

    if (this.id) {
      const url = this.baseUrl + "api/cities/" + this.city.id;

      this.http.put<City>(url, city).subscribe(result => {

        console.log("City " + city.id + " has been updated.");

        this.router.navigate(['/cities']);
      }, error => console.error(error));
    }
    else {
      const url = this.baseUrl + "api/cities";

      this.http.post<City>(url, city).subscribe(result => {

        console.log("City " + result.id + " has been created.");

        this.router.navigate(['/cities']);
      }, error => console.error(error));
    }
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      var city = <City>{};

      city.id = (this.id) ? this.id : 0;
      city.name = this.form.get("name").value;
      city.lat = +this.form.get("lat").value;
      city.lon = +this.form.get("lon").value;
      city.countryId = +this.form.get("countryId").value;

      const url = this.baseUrl + "api/cities/IsDupeCity";

      return this.http.post<boolean>(url, city).pipe(map(result => {
        return (result ? { isDupeCity: true } : null);
      }))
    }
  }
}
