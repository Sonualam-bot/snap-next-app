import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { connectToMongodb } from "./lib/db"
import User from "./models/userModel";



export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [ GitHub({
    clientId: process.env.AUTH_GITHUB_ID, clientSecret:process.env.AUTH_GITHUB_SECRET
}) ], 
secret: process.env.AUTH_SECRET,
callbacks: {
    async signIn({account, profile}){
        if(account?.provider === "github"){
            await connectToMongodb();
            try{
                const user = await User.findOne({email: profile?.email});
                if(!user){
                    const newUser = await User.create({
                        username: profile?.login,
                        email:profile?.email,
                        fullName: profile?.fullName,
                        avatar: profile?.avatar
                    })
                    await newUser.save();
                }

                return true; // indicate successfull login
            }catch(error){
                console.log(error)
                return false //indicate failed sign-in
            }
        }

        return false;   //indicate failed sign-in
    }
}
})