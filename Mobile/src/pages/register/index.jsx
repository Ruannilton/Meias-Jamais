import React, { Fragment, useState, useEffect, useMemo } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Feather,
    MaterialIcons,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import DateFunctions from '../../utils/DateFunctions';
import ImagePicker from '../../utils/ImagePicker';

import RequiredMessage from '../../components/ErrorsMessages/RequiredMessage';
import AvatarImage from '../../assets/register/avatarImage.png';
import AvatarFrame from '../../assets/register/avatarFrame.png';

import { style } from './styles';

const Register = () => {
    // state controls
    const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);
    const [isFirstPartCompleted, setIsFirstPartCompleted] = useState(false);
    // user data
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthday, setBirthday] = useState(null);

    const { register, handleSubmit, setValue, errors } = useForm({
        // mode: 'onBlur',
        // reValidateMode: 'onChange',
    });

    useEffect(() => {
        register({ name: 'image' }, { required: true });
        register({ name: 'name' }, { required: true });
        register({ name: 'user' }, { required: true });
        register({ name: 'email' }, { required: true });
        register({ name: 'birthday' }, { required: true });
        register({ name: 'password' }, { required: true });
        register({ name: 'confirmPassword' }, { required: true });
    }, [register]);

    // useEffect(() => {
    //     function showBirthday() {
    //         console.log(birthday);
    //     }
    //     showBirthday();
    // }, [birthday]);

    const handleName = (data) => {
        setValue('name', text);
        setName(data);
    };

    const handleImage = (image) => {
        setImage(image);
        setValue('image', image);
    };

    const setDate = (event, date) => {
        setDatePickerIsOpen(false);
        setBirthday(date);
        setValue('birthday', date);
    };

    const handleFirstSubmit = (data) => {
        console.log('oi');
        setIsFirstPartCompleted(true);
    };

    const handleSignUp = (data) => {
        console.log('oi');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <LinearGradient
                    style={style.pageBackground}
                    colors={['#E95359', '#F17A82']}
                    start={[0.5, 0]}
                    end={[0.9, 1]}
                >
                    {!isFirstPartCompleted ? (
                        <View style={style.formWrapper}>
                            <View style={style.inputsWrapper}>
                                <View style={style.imagePickerContainer}>
                                    <ImagePicker
                                        style={{
                                            alignItems: 'center',
                                        }}
                                        setImage={handleImage}
                                    >
                                        <Image
                                            source={
                                                !image
                                                    ? AvatarImage
                                                    : AvatarFrame
                                            }
                                            style={style.avatarFrame}
                                        />
                                        {image && (
                                            <Image
                                                source={{ uri: image }}
                                                style={style.avatarImage}
                                            />
                                        )}
                                    </ImagePicker>
                                </View>
                                {errors.image && (
                                    <RequiredMessage
                                        secondary
                                        style={{
                                            marginBottom: 10,
                                            alignSelf: 'center',
                                        }}
                                    />
                                )}
                                <View style={style.inputsContainerPartOne}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Feather
                                            name="user"
                                            size={30}
                                            color="#EF6360"
                                        />
                                        <TextInput
                                            style={style.inputText}
                                            placeholder="Nome"
                                            onChangeText={(text) =>
                                                setName(text)
                                            }
                                        />
                                    </View>
                                    {errors.name && (
                                        <RequiredMessage secondary />
                                    )}
                                    <View style={{ flexDirection: 'row' }}>
                                        <Feather
                                            name="at-sign"
                                            size={30}
                                            color="#EF6360"
                                        />
                                        <TextInput
                                            style={style.inputText}
                                            placeholder="Nome de Usuário"
                                            onChangeText={(text) =>
                                                setValue('user', text)
                                            }
                                        />
                                    </View>
                                    {errors.user && (
                                        <RequiredMessage secondary />
                                    )}
                                    <View
                                        style={{
                                            marginLeft: 2,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name="email-outline"
                                            size={28}
                                            color="#EF6360"
                                        />
                                        <TextInput
                                            style={style.inputText}
                                            placeholder="Email"
                                            onChangeText={(text) =>
                                                setValue('email', text)
                                            }
                                        />
                                    </View>
                                    {errors.email && (
                                        <RequiredMessage secondary />
                                    )}
                                    <View>
                                        <TouchableOpacity
                                            onPress={() =>
                                                setDatePickerIsOpen(true)
                                            }
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Feather
                                                name="clock"
                                                size={26}
                                                color="#EF6360"
                                                style={{ marginLeft: 3 }}
                                            />
                                            <Text
                                                style={[
                                                    style.inputDate,
                                                    !birthday
                                                        ? {
                                                              color: '#BEBEBE',
                                                          }
                                                        : {
                                                              color: 'black',
                                                          },
                                                ]}
                                            >
                                                {birthday
                                                    ? DateFunctions.Format(
                                                          birthday
                                                      )
                                                    : 'Data de Aniversário'}{' '}
                                            </Text>
                                            {datePickerIsOpen && (
                                                <DateTimePicker
                                                    mode="date"
                                                    value={new Date()}
                                                    locale="pt-BR"
                                                    onChange={(event, date) =>
                                                        setDate(event, date)
                                                    }
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    {errors.birthday && (
                                        <RequiredMessage secondary />
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity
                                style={style.goForwardButton}
                                onPress={handleSubmit(handleFirstSubmit)}
                            >
                                <Text style={style.goForwardButtonText}>
                                    Avançar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={[style.formWrapper, { marginTop: 140 }]}>
                            <View style={style.inputsWrapper}>
                                <View style={style.inputsContainerPartTwo}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <MaterialIcons
                                            name="lock-open"
                                            size={30}
                                            color="#EF6360"
                                        />
                                        <TextInput
                                            secureTextEntry
                                            style={style.inputText}
                                            placeholder="Senha"
                                            onChangeText={(text) =>
                                                setValue('password', text)
                                            }
                                        />
                                        {errors.password && (
                                            <RequiredMessage
                                                style={
                                                    {
                                                        // alignSelf: 'flex-start',
                                                        // marginLeft: 30,
                                                    }
                                                }
                                            />
                                        )}
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <MaterialIcons
                                            name="lock-outline"
                                            size={30}
                                            color="#EF6360"
                                        />
                                        <TextInput
                                            secureTextEntry
                                            style={style.inputText}
                                            placeholder="Confirme sua senha"
                                            onChangeText={(text) =>
                                                setValue(
                                                    'confirmPassword',
                                                    text
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={style.buttonsContainer}>
                                <TouchableOpacity
                                    style={style.goBackButton}
                                    onPress={() =>
                                        setIsFirstPartCompleted(false)
                                    }
                                >
                                    <Text>Voltar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.goBackButton}
                                    onPress={() => handleSignUp()}
                                >
                                    <Text style={style.createAccountButtonText}>
                                        Criar Conta
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <View style={style.footer}>
                        <Text style={style.footerText}>@Meias? Jamais™</Text>
                    </View>
                </LinearGradient>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Register;
