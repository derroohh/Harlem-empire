export interface CodeFile {
  name: string;
  language: 'java' | 'xml' | 'gradle';
  path: string;
  description: string;
  content: string;
}

export const androidJavaFiles: CodeFile[] = [
  {
    name: "MainActivity.java",
    language: "java",
    path: "app/src/main/java/com/android/cardshub/MainActivity.java",
    description: "Main Activity demonstrating Google OAuth Integration, Support Fragment handling, and Bottom Navigation setup using Support v4.",
    content: `package com.android.cardshub;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.squareup.picasso.Picasso;

/**
 * Android Support v4 equivalent of our interactive Hub.
 * Manages Google OAuth, custom light-themed status bars, and floating card fragments.
 */
public class MainActivity extends FragmentActivity implements GoogleApiClient.OnConnectionFailedListener {

    private static final int RC_SIGN_IN = 9001;
    private GoogleApiClient mGoogleApiClient;
    private TextView mStatusText;
    private ImageView mProfileImage;
    private BottomNavigationView mBottomNav;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Bind custom Light-Themed UI Status/Header items
        mStatusText = findViewById(R.id.tv_status_username);
        mProfileImage = findViewById(R.id.iv_statusbar_profile);
        mBottomNav = findViewById(R.id.bottom_navigation);

        // Configure Google Sign-In with standard scopes (Email, Profile, OpenID)
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestProfile()
                .build();

        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .enableAutoManage(this, this)
                .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
                .build();

        // Check if user is already signed in
        setupBottomNavigation();
        loadFragment(new HomeFragment());
        
        // Auto trigger sign-in if not authenticated (similar to our lock screen)
        findViewById(R.id.btn_google_oauth_signin).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signIn();
            }
        });
    }

    private void signIn() {
        Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleSignInResult(result);
        }
    }

    private void handleSignInResult(GoogleSignInResult result) {
        if (result.isSuccess()) {
            GoogleSignInAccount acct = result.getSignInAccount();
            if (acct != null) {
                mStatusText.setText(acct.getDisplayName());
                if (acct.getPhotoUrl() != null) {
                    Picasso.get()
                            .load(acct.getPhotoUrl())
                            .placeholder(R.drawable.ic_default_avatar)
                            .into(mProfileImage);
                }
                
                // Hide Login Card, show main Workspace
                findViewById(R.id.login_card_root).setVisibility(View.GONE);
                findViewById(R.id.android_screen_workspace).setVisibility(View.VISIBLE);
                mBottomNav.setVisibility(View.VISIBLE);
                
                Toast.makeText(this, "Welcome " + acct.getDisplayName(), Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(this, "Sign In Failed. Try again.", Toast.LENGTH_LONG).show();
        }
    }

    private void setupBottomNavigation() {
        mBottomNav.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment selectedFragment = null;
                switch (item.getItemId()) {
                    case R.id.nav_home:
                        selectedFragment = new HomeFragment();
                        break;
                    case R.id.nav_discover:
                        selectedFragment = new DiscoverFragment();
                        break;
                    case R.id.nav_tools:
                        selectedFragment = new ToolsFragment();
                        break;
                    case R.id.nav_account:
                        selectedFragment = new AccountFragment();
                        break;
                }
                return loadFragment(selectedFragment);
            }
        });
    }

    private boolean loadFragment(Fragment fragment) {
        if (fragment != null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, fragment)
                    .commit();
            return true;
        }
        return false;
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        Toast.makeText(this, "Google Play Services connection failed.", Toast.LENGTH_SHORT).show();
    }
}`
  },
  {
    name: "HomeFragment.java",
    language: "java",
    path: "app/src/main/java/com/android/cardshub/HomeFragment.java",
    description: "Support v4 Fragment hosting floating widgets/cards with simulated details and data storage via SharedPreferences.",
    content: `package com.android.cardshub;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.CardView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Locale;

/**
 * Support v4 Fragment mirroring elements of our Home Tab.
 * Renders Weather & Fitness widgets with custom actions, shadows, and status.
 */
public class HomeFragment extends Fragment {

    private int mStepsCount = 6420;
    private TextView mTvSteps;
    private TextView mTvWeatherTemp;
    private TextView mTvWeatherLocation;
    private SharedPreferences mPrefs;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        mPrefs = getActivity().getSharedPreferences("android_hub_prefs", Context.MODE_PRIVATE);
        mStepsCount = mPrefs.getInt("steps_logged", 6420);

        // Bind interactive widget items
        mTvSteps = view.findViewById(R.id.steps_count_display);
        mTvWeatherTemp = view.findViewById(R.id.weather_temp);
        mTvWeatherLocation = view.findViewById(R.id.weather_location);

        updateStepsDisplay();

        // Weather search button behavior
        final EditText etWeatherSearch = view.findViewById(R.id.weather_search_input);
        Button btnWeatherSearch = view.findViewById(R.id.btn_weather_search);
        btnWeatherSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String query = etWeatherSearch.getText().toString().trim();
                if (!query.isEmpty()) {
                    mTvWeatherLocation.setText(query + ", World");
                    mTvWeatherTemp.setText("75°F");
                    etWeatherSearch.setText("");
                }
            }
        });

        // Step accumulator buttons
        Button btnAdd500 = view.findViewById(R.id.btn_fitness_add_500);
        Button btnAdd1500 = view.findViewById(R.id.btn_fitness_add_1000);

        btnAdd500.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addSteps(500);
            }
        });

        btnAdd1500.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addSteps(1500);
            }
        });

        return view;
    }

    private void addSteps(int count) {
        mStepsCount += count;
        mPrefs.edit().putInt("steps_logged", mStepsCount).apply();
        updateStepsDisplay();
    }

    private void updateStepsDisplay() {
        if (mTvSteps != null) {
            mTvSteps.setText(String.format(Locale.US, "%,d / 10,000", mStepsCount));
        }
    }
}`
  },
  {
    name: "activity_main.xml",
    language: "xml",
    path: "app/src/main/res/layout/activity_main.xml",
    description: "Main layout establishing light-themed coordinates, floating CardView shadows, custom status bar headers, and navigation selectors.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_match"
    android:layout_height="match_parent"
    android:background="#FAF9F6"
    android:fitsSystemWindows="true">

    <!-- 1. Custom Light-Themed Support Status Bar Overlay -->
    <LinearLayout
        android:id="@+id/android_status_bar"
        android:layout_width="match_parent"
        android:layout_height="44dp"
        android:background="#EFEFEF"
        android:orientation="horizontal"
        android:paddingLeft="16dp"
        android:paddingRight="16dp"
        android:gravity="center_vertical">

        <TextView
            android:id="@+id/tv_statusbar_time"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="10:00 AM"
            android:textColor="#262626"
            android:textSize="12sp"
            android:textStyle="bold" />

        <View
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1" />

        <TextView
            android:id="@+id/tv_status_username"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginRight="8dp"
            android:text="Guest Mode"
            android:textColor="#404040"
            android:textSize="11dp" />

        <ImageView
            android:id="@+id/iv_statusbar_profile"
            android:layout_width="24dp"
            android:layout_height="24dp"
            android:scaleType="centerCrop"
            android:src="@drawable/ic_default_avatar" />
    </LinearLayout>

    <!-- 2. OAuth Authentication Screen (Shows if not logged in) -->
    <LinearLayout
        android:id="@+id/login_card_root"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/android_status_bar"
        android:orientation="vertical"
        android:gravity="center"
        android:padding="24dp">

        <android.support.v7.widget.CardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            app:cardCornerRadius="24dp"
            app:cardElevation="12dp"
            app:cardBackgroundColor="#FFFFFF"
            android:layout_margin="16dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="24dp"
                android:gravity="center">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Android Cards Hub"
                    android:textColor="#171717"
                    android:textSize="22sp"
                    android:textStyle="bold"
                    android:layout_marginBottom="8dp"/>

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Log in seamlessly using Google Identity support to launch coordinates."
                    android:textColor="#737373"
                    android:textSize="12sp"
                    android:gravity="center"
                    android:layout_marginBottom="24dp"/>

                <!-- Google OAuth Sign In Button -->
                <Button
                    android:id="@+id/btn_google_oauth_signin"
                    android:layout_width="match_parent"
                    android:layout_height="48dp"
                    android:text="Sign In With Google"
                    android:textAllCaps="false"
                    android:textColor="#FFFFFF"
                    android:background="@drawable/rounded_button_bg"
                    android:textStyle="bold"/>
            </LinearLayout>
        </android.support.v7.widget.CardView>
    </LinearLayout>

    <!-- 3. Main Workspace and Content Container -->
    <FrameLayout
        android:id="@+id/android_screen_workspace"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/android_status_bar"
        android:layout_above="@id/bottom_navigation"
        android:visibility="gone">

        <FrameLayout
            android:id="@+id/fragment_container"
            android:layout_width="match_parent"
            android:layout_height="match_parent"/>
    </FrameLayout>

    <!-- 4. Material You Style Bottom Navigation Bar -->
    <android.support.design.widget.BottomNavigationView
        android:id="@+id/bottom_navigation"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:layout_alignParentBottom="true"
        android:background="#FFFFFF"
        android:visibility="gone"
        app:menu="@menu/bottom_nav_menu"
        app:itemIconTint="#6366F1"
        app:itemTextColor="#4F46E5" />

</RelativeLayout>`
  },
  {
    name: "fragment_home.xml",
    language: "xml",
    path: "app/src/main/res/layout/fragment_home.xml",
    description: "Fragment XML layout implementing custom floating elements with thick round corners (24dp) and soft visual shadows using Support v7 CardView.",
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fillViewport="true"
    android:background="#F5F5F5">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <!-- 1. FLOATING WEATHER WIDGET CARD -->
        <android.support.v7.widget.CardView
            android:id="@+id/weather_card"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:cardCornerRadius="24dp"
            app:cardElevation="8dp"
            app:cardBackgroundColor="#FFFFFF">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="20dp">

                <RelativeLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Atmos Weather"
                        android:textColor="#1F2937"
                        android:textStyle="bold"
                        android:textSize="14sp" />

                    <TextView
                        android:id="@+id/weather_location"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_alignParentRight="true"
                        android:text="San Francisco, CA"
                        android:textColor="#6B7280"
                        android:textSize="11sp"
                        android:background="#F3F4F6"
                        android:padding="4dp" />
                </RelativeLayout>

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="horizontal"
                    android:gravity="center_vertical"
                    android:layout_marginBottom="12dp">

                    <TextView
                        android:id="@+id/weather_temp"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="72°F"
                        android:textColor="#111827"
                        android:textSize="32sp"
                        android:textStyle="bold" />

                    <View
                        android:layout_width="0dp"
                        android:layout_height="match_parent"
                        android:layout_weight="1" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Sunny conditions logged"
                        android:textColor="#4B5563"
                        android:textSize="12sp"/>
                </LinearLayout>

                <!-- City Search Area -->
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="horizontal">

                    <EditText
                        android:id="@+id/weather_search_input"
                        android:layout_width="0dp"
                        android:layout_height="40dp"
                        android:layout_weight="1"
                        android:hint="Try 'Tokyo', 'London'..."
                        android:textSize="12sp"
                        android:paddingLeft="12dp"
                        android:background="@drawable/rounded_edittext_bg"/>

                    <Button
                        android:id="@+id/btn_weather_search"
                        android:layout_width="80dp"
                        android:layout_height="40dp"
                        android:layout_marginLeft="6dp"
                        android:text="Check"
                        android:textSize="11sp"
                        android:textStyle="bold"/>
                </LinearLayout>
            </LinearLayout>
        </android.support.v7.widget.CardView>

        <!-- 2. FLOATING FITNESS WIDGET CARD -->
        <android.support.v7.widget.CardView
            android:id="@+id/fitness_card"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginBottom="16dp"
            app:cardCornerRadius="24dp"
            app:cardElevation="8dp"
            app:cardBackgroundColor="#FFFFFF">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="20dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Google Fit Tracker"
                    android:textColor="#059669"
                    android:textStyle="bold"
                    android:textSize="14sp"
                    android:layout_marginBottom="12dp"/>

                <TextView
                    android:id="@+id/steps_count_display"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="6,420 / 10,000"
                    android:textColor="#111827"
                    android:textSize="26sp"
                    android:textStyle="bold"/>

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="horizontal"
                    android:layout_marginTop="16dp">

                    <Button
                        android:id="@+id/btn_fitness_add_500"
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:layout_marginRight="4dp"
                        android:text="+500 steps"
                        android:textSize="11sp"/>

                    <Button
                        android:id="@+id/btn_fitness_add_1000"
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:layout_marginLeft="4dp"
                        android:text="+1,500 steps"
                        android:textSize="11sp"/>
                </LinearLayout>
            </LinearLayout>
        </android.support.v7.widget.CardView>

    </LinearLayout>
</ScrollView>`
  },
  {
    name: "build.gradle",
    language: "gradle",
    path: "app/build.gradle",
    description: "Android legacy gradle configuration holding correct pre-AndroidX dependencies for Google OAuth API client support.",
    content: `apply plugin: 'com.android.application'

android {
    compileSdkVersion 28
    defaultConfig {
        applicationId "com.android.cardshub"
        minSdkVersion 19
        targetSdkVersion 28
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    // Legacy Android Support v4 and v7 support libraries
    implementation 'android.support:support-v4:28.0.0'
    implementation 'android.support:appcompat-v7:28.0.0'
    implementation 'android.support:design:28.0.0'
    implementation 'android.support:cardview-v7:28.0.0'
    
    // Google OAuth client libraries
    implementation 'com.google.android.gms:play-services-auth:16.0.0'
    
    // Picasso for smooth light image avatar loading
    implementation 'com.squareup.picasso:picasso:2.71828'
}`
  }
];
