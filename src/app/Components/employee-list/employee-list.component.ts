import { Component } from '@angular/core';
import { UserInfoService } from '../../services/user/user-info.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {

  users: any[] = [];
  searchQuery: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';


  isModalVisible: boolean = false;
  selectedUser: any = null;



  constructor(private userInfoService: UserInfoService) { }

  ngOnInit(): void {
    this.loadUsers();
  }


  loadUsers(): void {
    this.userInfoService.getAllUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // 🔍 Filter Users by Search
  filteredUsers(): any[] {
    return this.users.filter(user =>
      user.user_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.user_ref_emp?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }


  // 🔥 Open Modal and Load User Permissions
  openEditPermissionsModal(user: any): void {
    this.selectedUser = { ...user, permissions: { ...user } }; // Clone user data
    this.isModalVisible = true;
  }

  // ✅ Close Modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedUser = null;
  }

  // ✅ Save Updated Permissions
  updateUserPermissions(): void {
    if (!this.selectedUser) return;

    const updatedPermissions = { ...this.selectedUser.permissions };

    this.userInfoService.updateUserPermissions(this.selectedUser.USER_ID, updatedPermissions).subscribe(
      () => {
        this.showNotificationPopup("تم تحديث صلاحيات المستخدم بنجاح ✅");
        this.loadUsers(); // Refresh user list
        this.closeModal();
      },
      (error) => {
        console.error('Error updating permissions:', error);
        this.showNotificationPopup("فشل تحديث الصلاحيات ❌");
      }
    );
  }


  // ✅ Approve User
  approveUser(userId: number): void {
    console.log(`User Approved: ${userId}`);
    this.showNotificationPopup("تمت الموافقة على المستخدم بنجاح ✅");
  }

  // ❌ Reject User
  rejectUser(userId: number): void {
    console.log(`User Rejected: ${userId}`);
    this.showNotificationPopup("تم رفض المستخدم ❌");
  }

  // 🔔 Show Notification
  showNotificationPopup(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000); // Hide after 3 seconds
  }

  // Close Notification Manually
  closeNotification(): void {
    this.showNotification = false;
  }

  deleteUser(userId: number): void {
    if (confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) {
      this.userInfoService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user.USER_ID !== userId); // Remove user from list
          this.showNotificationPopup("تم حذف المستخدم بنجاح ❌");
        },
        (error) => {
          console.error("Error deleting user:", error);
          this.showNotificationPopup("فشل حذف المستخدم ❌");
        }
      );
    }
  }


}
