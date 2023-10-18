import { Component , OnInit} from '@angular/core';

import { Router,NavigationEnd }  from '@angular/router';


@Component({
  selector: 'welcome-root',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit{
	title = 'TESTWAVE';
	constructor(private router: Router) {
	}

	ngOnInit() {
	}
}
