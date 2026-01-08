import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { AlertCardComponent } from '../../../shared/components/alert-card/alert-card.component';

interface DashboardStats {
  rooms: { available: number; total: number };
  alerts: number;
  teachers: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, AlertCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats>({
    rooms: { available: 20, total: 33 },
    alerts: 2,
    teachers: 30
  });

  chartData = signal([
    { day: 'Lun', coord: 80, avail: 90, limited: 70 },
    { day: 'Mar', coord: 90, avail: 98, limited: 75 },
    { day: 'Mer', coord: 90, avail: 106, limited: 80 },
    { day: 'Jeu', coord: 100, avail: 114, limited: 85 },
    { day: 'Ven', coord: 110, avail: 122, limited: 90 },
    { day: 'Sam', coord: 120, avail: 130, limited: 95 }
  ]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Charger les données depuis l'API
  }
}
